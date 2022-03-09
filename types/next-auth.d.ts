import NextAuth, { DefaultSession } from 'next-auth'
import { UserState } from '../structs/user'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      name: string
      image: string
    }
    /** 액세스 토큰. 계정 권한에 따라 있을 수도, 없을 수도 있습니다. */
    accessToken?: string
    /** Google 계정 고유 ID */
    id: string
    /** 계정 권한 */
    userState: UserState
    /** YouTube 권한이 부여됐는지에 대한 여부 */
    permissionGranted: boolean
  }
}
