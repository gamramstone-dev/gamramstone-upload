export const sendSimpleMessage = async (url: string, message: string) => {
  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: message,
    })
  }).then(v => v.json())

  if (result.status !== 200) {
    throw new Error('failed to send message')
  }
}

const functions = {
  send: sendSimpleMessage
}

export default functions