import 'normalize.css'

import { SSRProvider } from 'react-aria'
import { motion } from 'framer-motion'

import { AppProps } from 'next/app'
import Script from 'next/script'
import Head from 'next/head'

import 'remixicon/fonts/remixicon.css'

import { globalStyles } from '../structs/styles'

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
}

const Analytics = () => (
  <Script
    src='https://static.cloudflareinsights.com/beacon.min.js'
    data-cf-beacon='{"token": "f924609c5236459d85d8d025c8abb7b3"}'
  ></Script>
)

function MyApp ({ Component, pageProps, router }: AppProps) {
  globalStyles()

  return (
    <SSRProvider>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <Analytics></Analytics>
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
    </SSRProvider>
  )
}

export default MyApp
