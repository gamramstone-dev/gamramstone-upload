import '../styles/globals.scss'
import 'normalize.css'

import { AppProps } from 'next/app'
import { RecoilRoot, useRecoilValue } from 'recoil'

import { motion } from 'framer-motion'
import Header from '../components/Header'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import ConsoleWarning from '../components/ConsoleWarning'
import { darkModeAtom } from '../structs/setting'
import { ReactNode, useEffect } from 'react'

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
}

const DarkModeWrapper = ({ children }: { children: ReactNode }) => {
  const darkMode = useRecoilValue(darkModeAtom)

  useEffect(() => {
    document.documentElement.dataset.darkMode = darkMode ? 'true' : 'false'
  }, [darkMode])

  return <>{children}</>
}

function MyApp ({
  Component,
  pageProps: { session, ...pageProps },
  router,
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Head>
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicon-16x16.png'
          />
          <link rel='manifest' href='/site.webmanifest' />
          <link
            rel='stylesheet'
            type='text/css'
            href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css'
          />
        </Head>
        <ConsoleWarning></ConsoleWarning>
        <Header></Header>
        <Toaster position='top-center'></Toaster>
        <DarkModeWrapper>
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
        </DarkModeWrapper>
      </RecoilRoot>
    </SessionProvider>
  )
}

export default MyApp
