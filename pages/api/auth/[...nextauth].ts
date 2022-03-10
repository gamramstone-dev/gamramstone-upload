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
          scope: 'openid profile',
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

      /**
       * 로그인 기능이 준비되지 않는 경우 환경 변수 설정을 통해 모든 로그인을 시도를 막을 수 있습니다.
       */
      if (process.env.GOOGLE_NOT_READY === 'true') {
        return false
      }

      const savedUser = await getUser(user.id)

      const hasYouTubeScope =
        account.scope && account.scope.indexOf('auth/youtube') > -1

      /**
       * YouTube 권한이 부여는 되었지만 저장된 유저 정보가 없거나 크리에이터 권한이 없는 경우 오류를 표시합니다.
       */
      if (
        hasYouTubeScope &&
        (!savedUser || !hasCreatorPermission(savedUser.state))
      ) {
        return '/noauth?error=NoYouTubePermission'
      }

      /**
       * 저장된 유저 정보가 없으면 새로 생성합니다.
       */
      if (savedUser === null) {
        try {
          await createUser(user.id)
        } catch (e) {
          return '/noauth?error=FailedToCreateUser'
        }

        return true
      }

      /**
       * 유저가 차단된 상태면 오류를 표시합니다.
       */
      if (savedUser.state === 'banned') {
        return '/noauth?error=Banned'
      }

      const userFields: Partial<DatabaseUser> = {
        lastLogin: new Date().toISOString(),
      }

      /**
       * 크리에이터 권한이 없는데 YouTube 권한이 부여되었다면 계정 소유 확인 후 크리에이터 권한을 부여합니다.
       */
      if (
        hasYouTubeScope &&
        !hasCreatorPermission(savedUser.state) &&
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
          console.error(e)

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
      session.id = token.id as string
      session.permissionGranted =
        typeof token.scope === 'string' &&
        token.scope.indexOf('auth/youtube.force-ssl') !== -1

      const user = await getUser(token.id as string)

      session.userState = user?.state || 'guest'
      session.lastLogin = token.lastLogin
      session.uuid = token.uuid

      if (hasCreatorPermission(user!.state!)) {
        session.accessToken = token.accessToken as string | undefined
      }

      return session
    },
  },
})
