import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { Channels } from '../../../structs/channels'
import { DatabaseUser, hasCreatorPermission } from '../../../structs/user'
import { createUser, getUser, updateUser } from '../../../utils/server/database'
import { getMyYouTubeChannelID } from '../../../utils/youtube'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            'openid profile',
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

      const hasYouTubeScope =
        account.scope && account.scope.indexOf('auth/youtube') > -1

      if (
        (!savedUser || !hasCreatorPermission(savedUser.state)) &&
        hasYouTubeScope
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

      const userFields: Partial<DatabaseUser> = {
        lastLogin: new Date().toISOString(),
      }

      if (
        !hasCreatorPermission(savedUser.state) &&
        hasYouTubeScope &&
        typeof account.access_token === 'string'
      ) {
        try {
          const id = await getMyYouTubeChannelID(account.access_token)

          const hasRegisteredID =
            Object.values(Channels).filter(v => v.channelId === id).length > 0

          if (!hasRegisteredID) {
            return '/noauth?error=NoYouTubePermission'
          }
        } catch (e) {
          return '/noauth?error=NoYouTubePermission'
        }

        userFields.state = 'creator'
      }

      await updateUser(user.id, userFields)

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
          token.lastLogin = savedUser.lastLogin
          token.uuid = savedUser.uuid
        }
      }

      return token
    },
    async session ({ session, token }) {
      session.id = token.id
      session.permissionGranted =
        typeof token.scope === 'string' &&
        token.scope.indexOf('auth/youtube.force-ssl') !== -1

      const user = await getUser(token.id as string)

      session.userState = user?.state
      session.lastLogin = token.lastLogin
      session.uuid = token.uuid

      if (hasCreatorPermission(user!.state!)) {
        session.accessToken = token.accessToken
      }

      return session
    },
  },
})
