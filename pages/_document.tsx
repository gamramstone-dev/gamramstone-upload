import Document, { Html, Head, Main, NextScript } from 'next/document'

import crypto from 'crypto'

const cspHashOf = (text: string) => {
  const hash = crypto.createHash('sha256')
  hash.update(text)
  return `'sha256-${hash.digest('base64')}'`
}

class MyDocument extends Document {
  render () {
    let csp = `default-src 'self' https://dl.airtable.com/ https://cloudflareinsights.com/cdn-cgi/rum https://vitals.vercel-insights.com/v1/vitals https://*.googleapis.com; form-action 'none'; img-src * data:; font-src *; object-src 'none'; style-src 'self' https://cdnjs.cloudflare.com/ajax/libs/pretendard/1.2.1/static/pretendard-dynamic-subset.css 'unsafe-inline'; script-src 'self' https://static.cloudflareinsights.com/beacon.min.js ${cspHashOf(
      NextScript.getInlineScriptSource(this.props)
    )}`

    if (process.env.NODE_ENV !== 'production') {
      csp = `style-src 'self' https://cdnjs.cloudflare.com/ajax/libs/pretendard/1.2.1/static/pretendard-dynamic-subset.css 'unsafe-inline'; font-src *; connect-src *; form-action 'none'; default-src 'self' https://*.googleapis.com/ https://dl.airtable.com/; img-src * data:; object-src 'none'; script-src 'unsafe-eval' 'self' https://static.cloudflareinsights.com/beacon.min.js ${cspHashOf(
        NextScript.getInlineScriptSource(this.props)
      )}`
    }

    return (
      <Html>
        <Head>
          <meta httpEquiv='Content-Security-Policy' content={csp} />
          <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
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
            href='https://cdnjs.cloudflare.com/ajax/libs/pretendard/1.2.1/static/pretendard-dynamic-subset.css'
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
