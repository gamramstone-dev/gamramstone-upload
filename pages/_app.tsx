import '../styles/globals.scss'
import 'normalize.css'

import { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'

import { motion } from 'framer-motion'
import Header from '../components/Header'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
}

function MyApp ({
  Component,
  pageProps: { session, ...pageProps },
  router,
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Header></Header>
        <Toaster position='top-center'></Toaster>
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
