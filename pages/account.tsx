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
import { Button } from '../components/Button'
import { useTranslation } from 'react-i18next'

const Account: NextPage = () => {
  const router = useRouter()
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      // router.push('/')
    },
  })
  const { t } = useTranslation()

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

    const loading = toast.loading(t('removing_account'))

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
      toast.error(t('failed_to_remove_account'))
    }
  }, [t, session])

  return (
    <div className={styles.container}>
      <Head>
        <title>
          {t('manage_account')} - {t('gamramstone')}
        </title>
      </Head>
      <div className={pageStyles.page}>
        <div className={classes(pageStyles.contents, styles.heading)}>
          <div className={styles.inner}>
            <span>{t('manage_account')}</span>
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
              title: t('sign_out'),
              description: t('sign_out_description'),
              type: 'button',
            }}
            onChange={() => signOut()}
          />
          {session?.userState === 'creator' ||
          session?.userState === 'admin' ? (
            <SettingCard
              setting={{
                title: t('link_account'),
                description:
                  (session && session.permissionGranted) || false ? (
                    <>
                      이미 연동되었습니다.<br></br>사용하는 정보 내용은{' '}
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
              onChange={() =>
                signIn(
                  'google',
                  undefined,
                  window.location.href.indexOf('?wak') > -1
                    ? {
                        scope:
                          'openid profile https://www.googleapis.com/auth/youtube.force-ssl',
                        prompt: 'select_account',
                      }
                    : {
                        scope:
                          'openid profile https://www.googleapis.com/auth/youtube.force-ssl',
                      }
                )
              }
            />
          ) : (
            undefined
          )}
          <SettingCard
            setting={{
              title: t('remove_account'),
              description: (
                <>
                  {t('remove_account_description')}
                  <br></br>
                  {session ? (
                    <>
                      {t('remove_account_currently', {
                        userState: session.userState,
                      })}
                    </>
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
            {t('last_login')} :{' '}
            {session &&
              session.lastLogin &&
              new Date(session.lastLogin as string).toLocaleString()}
          </p>
          <p className={styles.mute}>UUID : {session && session.uuid}</p>
        </div>
        {session?.userState === 'admin' ? (
          <div className={classes(pageStyles.contents)}>
            <Button onClick={() => router.push('/admin')}>
              {t('go_site_management')}
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
