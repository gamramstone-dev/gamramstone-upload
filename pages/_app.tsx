import '../styles/globals.scss'
import 'normalize.css'

import { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'

import { motion } from 'framer-motion'
import Header from '../components/Header'
import Head from 'next/head'

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
}

function MyApp ({ Component, pageProps, router }: AppProps) {
  return (
    <RecoilRoot>
      <Header></Header>
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
  )
}

export default MyApp
