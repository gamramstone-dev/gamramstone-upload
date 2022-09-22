import 'normalize.css'

import { AppProps } from 'next/app'

import { motion } from 'framer-motion'

import Script from 'next/script'
import Head from 'next/head'

import 'remixicon/fonts/remixicon.css'

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
}

function MyApp ({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <Script
        src='https://static.cloudflareinsights.com/beacon.min.js'
        data-cf-beacon='{"token": "f924609c5236459d85d8d025c8abb7b3"}'
      ></Script>
      <motion.div
        key={router.route}
        variants={variants}
        initial='hidden'
        animate='enter'
        exit='exit'
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <Component {...pageProps} />
      </motion.div>
    </>
  )
}

export default MyApp
