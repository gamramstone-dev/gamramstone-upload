import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

const Document = () => {
  return (
    <Html>
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
      <Script
        src='https://static.cloudflareinsights.com/beacon.min.js'
        data-cf-beacon='{"token": "f924609c5236459d85d8d025c8abb7b3"}'
      ></Script>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
