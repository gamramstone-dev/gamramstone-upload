import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { v4 } from 'uuid'
import { getUser } from '../../../utils/database'

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
    async signIn({ user, credentials }) {
      console.log(`${user.name} (${user.id}) tried to sign in!`)

      if (process.env.GOOGLE_NOT_READY === 'true') {
        return false
      }

      const savedUser = await getUser(user.id)

      if (savedUser === null) {
        return false
      }

      return true
    },
    async jwt ({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = account.providerAccountId
      }

      return token
    },
    async session ({ session, token }) {
      session.accessToken = token.accessToken
      session.id = token.id

      return session
    },
  },
})
