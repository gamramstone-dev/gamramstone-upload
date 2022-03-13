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

export const sendSimpleMessage = async (url: string, message: string, extra?: Record<string, unknown>) => {
  const result = await fetch(url + '?wait=true', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: message,
      ...extra
    }),
  }).then(v => {
    return v.json()
  })

  if (typeof result.id === 'undefined') {
    console.error(result)

    throw new Error('failed to send a message')
  }

  return result
}

export const sendEmbedMessage = async (url: string, data: DiscordEmbed[], extra?: Record<string, unknown>) => {
  const result = await fetch(url + '?wait=true', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      embeds: data,
      ...extra
    }),
  }).then(v => {
    return v.json()
  })

  if (typeof result.id === 'undefined') {
    console.error(result)

    throw new Error('failed to send a message')
  }

  return result
}

const functions = {
  send: sendSimpleMessage,
  sendFancy: sendEmbedMessage,
}

export default functions
