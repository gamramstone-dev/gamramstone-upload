import Document, { Html, Head, Main, NextScript } from 'next/document'

import crypto from 'crypto'

const cspHashOf = (text: string) => {
  const hash = crypto.createHash('sha256')
  hash.update(text)
  return `'sha256-${hash.digest('base64')}'`
}

class MyDocument extends Document {
  render () {
    let csp = `default-src 'self' data:image/; image-src *; font-src *; style-src 'self' https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css; script-src 'self' https://static.cloudflareinsights.com/beacon.min.js ${cspHashOf(
      NextScript.getInlineScriptSource(this.props)
    )}`

    if (process.env.NODE_ENV !== 'production') {
      csp = `style-src 'self' https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css 'unsafe-inline'; font-src *; default-src 'self' https://static.cloudflareinsights.com/beacon.min.js data: https://cloudflareinsights.com/cdn-cgi/rum; image-src *; script-src 'unsafe-eval' 'self' https://static.cloudflareinsights.com/beacon.min.js ${cspHashOf(
        NextScript.getInlineScriptSource(this.props)
      )}`
    }

    return (
      <Html>
        <Head>
          <meta httpEquiv='Content-Security-Policy' content={csp} />
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
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
