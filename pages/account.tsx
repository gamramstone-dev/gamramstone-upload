import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import pageStyles from '../styles/page.module.scss'
import styles from '../styles/pages/Account.module.scss'
import { classes } from '../utils/string'
import { getSession, signIn, useSession } from 'next-auth/react'
import SettingCard from '../components/SettingCard'
import {
  globalSettings,
  SettingID,
  Settings,
  SettingTypes,
} from '../structs/setting'
import { useCallback } from 'react'
import { useRecoilState } from 'recoil'

const Account: NextPage = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => signIn('google'),
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

  return (
    <div className={styles.container}>
      <Head>
        <title>계정 관리 - 감람스톤</title>
      </Head>
      <div className={pageStyles.page}>
        <div className={classes(pageStyles.contents, styles.heading)}>
          <div className={styles.inner}>
            <span>{session?.user?.name}님,</span>
            <span>안녕하세요!</span>
          </div>
        </div>

        <div className={classes(pageStyles.contents, styles.grid)}>
          {(Object.keys(Settings) as SettingID[]).map(setting => (
            <SettingCard
              key={`setting-${Settings[setting].id}`}
              setting={{
                ...Settings[setting],
                value: Settings[setting].default,
              }}
              onChange={(value: SettingTypes[SettingID]) =>
                updateSetting(Settings[setting].id, value)
              }
            ></SettingCard>
          ))}
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
