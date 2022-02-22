import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { v4 } from 'uuid'
import { createRegisterRequest, getUser } from '../../../utils/database'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            'openid profile https://www.googleapis.com/auth/youtubepartner',
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
    async signIn ({ user }) {
      console.log(`${user.name} (${user.id}) tried to sign in!`)

      if (process.env.GOOGLE_NOT_READY === 'true') {
        return false
      }

      const savedUser = await getUser(user.id)

      if (savedUser === null) {
        const uuid = v4()

        const result = await createRegisterRequest(uuid, `${user.id} | ${user.name}`)

        if (!result) {
          return false
        }

        return `/noauth?error=AccessDenied&code=${uuid}`
      }

      return true
    },
    async jwt ({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = account.providerAccountId
        token.scope = account.scope
      }

      return token
    },
    async session ({ session, token }) {
      session.id = token.id
      session.permissionGranted =
        typeof token.scope === 'string' &&
        token.scope.indexOf('auth/youtubepartner') !== -1

      if (session.permissionGranted) {
        session.accessToken = token.accessToken
      }

      return session
    },
  },
})
