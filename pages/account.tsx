import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import pageStyles from '../styles/page.module.scss'
import styles from '../styles/pages/Account.module.scss'
import { classes } from '../utils/string'
import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import SettingCard from '../components/SettingCard'
import {
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
  })

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
    if (!session || !session.accessToken) {
      return
    }

    const data = await fetch(
      `https://accounts.google.com/o/oauth2/revoke?token=${session.accessToken}`
    ).then(v => v.json())

    if (data.error) {
      toast.error('세션이 만료되었습니다. 로그아웃 했다가 다시 탈퇴하세요.')
      return
    }

    const result = await fetch('/api/auth/unregister', {
      method: 'POST',
    }).then(v => v.json())

    if (result.status === 'success') {
      signOut()
    } else {
      toast.error('계정 삭제 실패, gamramstone @ wesub.io로 문의하세요.')
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
            <span>
              {isWakgoodHyeong(session?.user?.name)
                ? `왁굳형!`
                : `${session?.user?.name} 님,`}
            </span>
            <span>안녕하세요!</span>
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
          <SettingCard
            setting={{
              title: '추가 권한 요청',
              description: (
                <>
                  사이트에 YouTube 계정에 접근할 수 있는 권한을 요청합니다.
                  자세한 사항은 <Link href='/privacy'>개인정보 처리방침</Link>을
                  확인하세요.
                </>
              ),
              type: 'button',
            }}
            onChange={() => signIn('google')}
          />
          <SettingCard
            setting={{
              title: '계정 삭제',
              description: (
                <>
                  사이트에서 계정을 삭제합니다. 삭제 후 다시 가입하려면 관리자
                  승인이 다시 필요합니다.
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
