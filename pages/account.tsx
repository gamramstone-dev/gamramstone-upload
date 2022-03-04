import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import pageStyles from '../styles/page.module.scss'
import styles from '../styles/pages/Account.module.scss'
import { classes } from '../utils/string'
import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import SettingCard from '../components/SettingCard'
import {
  CustomUseSession,
  globalSettings,
  SettingID,
  Settings,
  SettingTypes,
} from '../structs/setting'
import { useCallback, useEffect, useRef } from 'react'
import { useRecoilState } from 'recoil'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Footer from '../components/Footer'
import Link from 'next/link'
import { UserStateNames } from '../structs/user'
import { Button } from '../components/Button'

const isWakgoodHyeong = (name?: unknown) => {
  return name === '우왁굳의 게임방송' || name === '왁타버스 WAKTAVERSE'
}

const Account: NextPage = () => {
  const router = useRouter()
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push('/')
    },
  }) as CustomUseSession

  const [settings, setSettings] = useRecoilState(globalSettings)

  const updateSetting = useCallback(
    (key: SettingID, setting: SettingTypes[SettingID]) => {
      setSettings({
        [key]: setting,
      })
    },
    [setSettings]
  )

  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }

    fetch('/api/settings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    })
  }, [settings])

  const removeAccount = useCallback(async () => {
    if (!session) {
      return
    }

    const loading = toast.loading('계정 삭제 중...')

    const result = await fetch('/api/user/unregister', {
      method: 'POST',
    })
      .then(v => v.json())
      .finally(() => toast.remove(loading))

    if (result.status === 'success') {
      signOut()
    } else if (result.status === 'error' && result.message) {
      toast.error(result.message)
    } else {
      toast.error('계정 삭제 실패, gamramstone@wesub.io로 문의하세요.')
    }
  }, [session])

  return (
    <div className={styles.container}>
      <Head>
        <title>계정 관리 - 감람스톤</title>
      </Head>
      <div className={pageStyles.page}>
        <div className={classes(pageStyles.contents, styles.heading)}>
          <div className={styles.inner}>
            <span>계정 관리</span>
          </div>
        </div>

        <div className={classes(pageStyles.contents, styles.grid)}>
          {(Object.keys(Settings) as SettingID[]).map(setting => (
            <SettingCard
              key={`setting-${Settings[setting].id}`}
              setting={{
                ...Settings[setting],
                value:
                  typeof settings['darkMode'] !== 'undefined'
                    ? settings['darkMode']
                    : Settings[setting].default,
              }}
              onChange={(value: SettingTypes[SettingID]) =>
                updateSetting(Settings[setting].id, value)
              }
            ></SettingCard>
          ))}
          <SettingCard
            setting={{
              title: '로그아웃',
              description: '사이트에서 로그아웃합니다.',
              type: 'button',
            }}
            onChange={() => signOut()}
          />
          {session?.userState === 'creator' ||
          session?.userState === 'admin' ? (
            <SettingCard
              setting={{
                title: '권한 부여',
                description:
                  (session && session.permissionGranted) || false ? (
                    <>
                      이미 권한이 부여되었습니다.<br></br>사용하는 정보 내용은{' '}
                      <Link href='/privacy'>개인정보 처리방침</Link>을
                      확인하세요.
                    </>
                  ) : (
                    <>
                      YouTube 계정에 접근할 수 있는 권한을 부여합니다.<br></br>
                      자세한 사항은{' '}
                      <Link href='/privacy'>개인정보 처리방침</Link>을
                      확인하세요.
                    </>
                  ),
                disabled: (session && session.permissionGranted) || false,
                type: 'button',
              }}
              onChange={() => signIn('google')}
            />
          ) : (
            undefined
          )}
          <SettingCard
            setting={{
              title: '계정 삭제',
              description: (
                <>
                  사이트에서 계정을 삭제합니다.<br></br>
                  {session ? (
                    <>현재 {UserStateNames[session.userState]} 계정입니다.</>
                  ) : (
                    undefined
                  )}
                </>
              ),
              type: 'button',
              elementParams: {
                theme: 'danger',
              },
            }}
            onChange={() => removeAccount()}
          />
        </div>
        <div className={classes(pageStyles.contents, styles.accountData)}>
          <p className={styles.mute}>
            마지막 로그인 :{' '}
            {session &&
              session.lastLogin &&
              new Date(session.lastLogin as string).toLocaleString()}
          </p>
          <p className={styles.mute}>UUID : {session && session.uuid}</p>
        </div>
        {session?.userState === 'admin' ? (
          <div className={classes(pageStyles.contents)}>
            <Button onClick={() => router.push('/admin')}>
              사이트 관리하러 가기
            </Button>
          </div>
        ) : (
          void 0
        )}
      </div>
      <Footer></Footer>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {
      session: await getSession(ctx),
    },
  }
}

export default Account
