import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
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
  session: { strategy: 'jwt' },
  pages: {
    error: '/noauth',
  },
  callbacks: {
    async signIn ({ user }) {
      const savedUser = getUser(user.id)

      if (savedUser === null) {
        return false
      }

      return true
    },
    async jwt ({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session ({ session, token, user }) {
      session.accessToken = token.accessToken
      return session
    },
  },
})
