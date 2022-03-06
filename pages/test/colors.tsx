import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import pageStyles from '../../styles/page.module.scss'
import styles from '../../styles/pages/Test.module.scss'
import { classes } from '../../utils/string'
import { getSession } from 'next-auth/react'
import { Channels } from '../../structs/channels'
import { CSSProperties } from 'react'
import { useRecoilState } from 'recoil'
import { darkModeAtom } from '../../structs/setting'
import { Button } from '../../components/Button'
import toast from 'react-hot-toast'

import confetties from '../../utils/confetties'

export interface CustomStyles extends CSSProperties {
  [key: string]: unknown
}

const YouTubeTestPage: NextPage = () => {
  const [dark, setDark] = useRecoilState(darkModeAtom)

  return (
    <div className={styles.container}>
      <Head>
        <title>감람스톤</title>
      </Head>
      <div className={pageStyles.page}>
        <div className={pageStyles.largeContents}>
          <div className={styles.channels}>
            {Object.keys(Channels).map(v => (
              <div
                key={v}
                className={styles.member}
                style={
                  {
                    '--background': `var(--${v}-color-background)`,
                  } as CustomStyles
                }
              >
                <div className={styles.memberName}>{v}</div>
                {['primary', 'secondary', 'tertiary'].map(c => (
                  <div
                    key={`${v}-${c}-wrapper`}
                    className={styles.colorWrapper}
                  >
                    <div
                      key={`${v}-${c}`}
                      className={styles.color}
                      style={
                        {
                          '--color': `var(--${v}-color-${c})`,
                          '--color-on': `var(--${v}-color-on-${c})`,
                        } as CustomStyles
                      }
                    >
                      <div className={styles.default}>
                        <span>{c}</span>
                      </div>
                      <div className={styles.invert}>
                        <span>{c[0]}-invert</span>
                      </div>
                    </div>
                    <div
                      key={`${v}-${c}`}
                      className={classes(styles.color, styles.container)}
                      style={
                        {
                          '--color': `var(--${v}-color-${c}-container)`,
                          '--color-on': `var(--${v}-color-on-${c}-container)`,
                        } as CustomStyles
                      }
                    >
                      <div className={styles.default}>
                        <span>{c}-c</span>
                      </div>
                      <div className={styles.invert}>
                        <span>{c[0]}c-invert</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <Button onClick={() => toast('Test message is here')}>
            Test button is here
          </Button>
          <Button onClick={() => toast.success('Success message is here')}>
            Success button is here
          </Button>
          <Button onClick={() => toast.loading('Loading message is here')}>
            Loadding button is here
          </Button>
          <Button onClick={() => toast.error('Error message is here')}>
            Error button is here
          </Button>
          <Button onClick={() => setDark(!dark)}>switch darkmode</Button>
          <br></br>
          <Button onClick={() => confetties.fireworks()}>party</Button>
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

export default YouTubeTestPage
