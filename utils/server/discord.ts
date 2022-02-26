export interface DiscordEmbed {
  title?: string
  description?: string
  url?: string
  timestamp?: string
  color?: number
  footer?: {
    text: string
    icon_url?: string
    proxy_icon_url?: string
  }
  image?: {
    url: string
  }
  thumbnail?: {
    url: string
  }
  video?: {
    url?: string
  }
  author?: {
    name: string
    url?: string
    icon_url?: string
    proxy_icon_url?: string
  }
  fields?: {
    name: string
    value: string
    inline?: boolean
  }[]
}

export const sendSimpleMessage = async (url: string, message: string) => {
  const result = await fetch(url + '?wait=true', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // content: message,
    }),
  }).then(v => {
    console.log(v.headers)

    return v.json()
  })

  if (result.status !== 200) {
    throw new Error('failed to send message')
  }

  return result
}

export const sendEmbedMessage = async (url: string, data: DiscordEmbed[]) => {
  const result = await fetch(url + '?wait=true', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      embeds: data,
    }),
  }).then(v => {
    console.log(v.headers)

    return v.json()
  })

  if (result.status !== 200) {
    throw new Error('failed to send message')
  }

  return result
}

const functions = {
  send: sendSimpleMessage,
  sendFancy: sendEmbedMessage
}

export default functions
