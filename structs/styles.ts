import { createStitches, CSS as StitchesCSS } from '@stitches/react'

export const {
  styled,
  css,
  getCssText,
  createTheme,
  globalCss,
  config,
} = createStitches({
  media: {
    mobile: '(max-width: 640px)',
    tablet: '(max-width: 1024px)',
  },

  theme: {
    colors: {
      primary: '#0b9eee',
      primary70: 'rgba(33, 126, 211, 0.7)',
    },
  },
})

export type CSS = StitchesCSS<typeof config>

export const globalStyles = globalCss({
  'html, body': {
    fontFamily: `-apple-system, BlinkMacSystemFont, Pretendard, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,

    '@tablet': {
      fontSize: '0.95em',
    },

    '@mobile': {
      fontSize: '0.9em',
    },
  },
})
