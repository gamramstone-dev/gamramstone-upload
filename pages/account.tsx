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
        </div>
      </div>
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
