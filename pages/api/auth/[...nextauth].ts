import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { hasCreatorPermission } from '../../../structs/user'
import {
  createUser,
  getUser,
  updateUser,
} from '../../../utils/database'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            'openid profile https://www.googleapis.com/auth/youtube.force-ssl',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 3600,
  },
  pages: {
    error: '/noauth',
  },
  callbacks: {
    async signIn ({ user, account }) {
      console.log(`${user.name} (${user.id}) tried to sign in!`)

      if (process.env.GOOGLE_NOT_READY === 'true') {
        return false
      }

      const savedUser = await getUser(user.id)

      if (
        (!savedUser || !hasCreatorPermission(savedUser.state)) &&
        account.scope &&
        account.scope.indexOf('auth/youtube') > -1
      ) {
        return '/noauth?error=NoYouTubePermission'
      }

      if (savedUser === null) {
        try {
          await createUser(user.id)
        } catch (e) {
          return '/noauth?error=FailedToCreateUser'
        }

        return true
      }

      if (savedUser.state === 'banned') {
        return '/noauth?error=Banned'
      }

      await updateUser(user.id, {
        lastLogin: new Date().toISOString(),
      })

      return true
    },
    async jwt ({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = account.providerAccountId
        token.scope = account.scope

        const savedUser = await getUser(account.providerAccountId)

        if (savedUser !== null) {
          token.userState = savedUser.state
        }
      }

      return token
    },
    async session ({ session, token }) {
      session.id = token.id
      session.permissionGranted =
        typeof token.scope === 'string' &&
        token.scope.indexOf('auth/youtube.force-ssl') !== -1
      session.userState = token.userState
      session.accessToken = token.accessToken

      return session
    },
  },
})
