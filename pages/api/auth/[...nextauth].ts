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
  session: {
    strategy: 'jwt',
    maxAge: 3600
  },
  pages: {
    error: '/noauth',
  },
  callbacks: {
    async signIn ({ user }) {
      console.log(`${user.name} (${user.id}) tried to sign in!`)

      const savedUser = await getUser(user.id)

      if (savedUser === null) {
        return false
      }

      return true
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = account.providerAccountId
      }

      return token
    },
    async session ({ session, token, user }) {
      session.accessToken = token.accessToken
      session.id = token.id

      return session
    },
  },
})
