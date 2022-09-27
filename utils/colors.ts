import chroma from 'chroma-js'

export const getPastelColor = (c: string, luminance = 0.9) => {
  return chroma(c).set('hsl.l', luminance).hex()
}