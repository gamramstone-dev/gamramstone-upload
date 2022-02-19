import '../styles/globals.scss'
import 'normalize.css'

import { AppProps } from 'next/app'
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil'

import { motion } from 'framer-motion'
import Header from '../components/Header'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'
import ConsoleWarning from '../components/ConsoleWarning'
import { darkModeAtom, globalSettings } from '../structs/setting'
import { useEffect } from 'react'
import Script from 'next/script'

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
}

const useDarkMode = () => {
  const darkMode = useRecoilValue(darkModeAtom)

  useEffect(() => {
    document.documentElement.dataset.darkMode = darkMode ? 'true' : 'false'
  }, [darkMode])
}

const useSettingSync = () => {
  const [settings, setSettings] = useRecoilState(globalSettings)

  useEffect(() => {
    const getSettings = async () => {
      const result = await fetch('/api/settings').then(v => v.json())

      if (result.status === 'success') {
        const data = JSON.parse(result.data)

        setSettings(data)
      }
    }

    getSettings()
  }, [setSettings])
}

const ContextUser = () => {
  useDarkMode()
  useSettingSync()

  return <></>
}

function MyApp ({
  Component,
  pageProps: { session, ...pageProps },
  router,
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Script
          src='https://static.cloudflareinsights.com/beacon.min.js'
          data-cf-beacon='{"token": "f924609c5236459d85d8d025c8abb7b3"}'
        ></Script>
        <ConsoleWarning></ConsoleWarning>
        <Header></Header>
        <Toaster position='top-center'></Toaster>
        <ContextUser></ContextUser>
        <motion.div
          key={router.route}
          variants={variants}
          className={'page-wrapper'}
          initial='hidden'
          animate='enter'
          exit='exit'
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <Component {...pageProps} />
        </motion.div>
      </RecoilRoot>
    </SessionProvider>
  )
}

export default MyApp
