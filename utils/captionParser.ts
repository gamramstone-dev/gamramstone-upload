export interface CaptionLine {
  text: string
  start: number
  end: number
  index?: number
}

const parseTimestamp = (str: string) => {
  const [h, m, s, ss] = str.split(/\,|:/g).map(v => Number(v))
  return h * 3600 + m * 60 + s + ss / 1000
}

const SRTParse = (data: string): CaptionLine[] => {
  return data
    .split(/\r\n\r\n+/gi)
    .map(v => {
      const line = v.split(/\r/g).map(v => v.trim()).filter(v => v !== '')

      if (line.length < 2) {
        return null
      }

      const split = line[1].split(' --> ')

      if (!split[0] || !split[1]) {
        throw new Error(`Invalid Timestamp Data. Got : ${v}`)
      }

      return {
        index: Number(line[0]),
        start: parseTimestamp(split[0]),
        end: parseTimestamp(split[1]),
        text: line.slice(2, line.length).join('\n'),
      }
    })
    .filter(v => v !== null) as unknown as CaptionLine[]
}

const parse = (filename: string, data: string) => {
  if (filename.endsWith('.srt')) {
    return SRTParse(data)
  }

  return null
}

const commands = {
  parse,
}

export default commands
