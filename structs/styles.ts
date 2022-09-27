import { createStitches, CSS as StitchesCSS } from '@stitches/react'

export const {
  styled,
  css,
  getCssText,
  createTheme,
  globalCss,
  keyframes,
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
      gamramstone: '#028527',
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

const skeleton_keyframes = keyframes({
  '0%': {
    backgroundPosition: '-100% 0',
  },

  '100%': {
    backgroundPosition: '100% 0',
  },
})

export const skeleton = {
  keyframes: skeleton_keyframes,
  background: `linear-gradient(to right, rgba(130, 130, 130, 0.2) 8%, rgba(130, 130, 130, 0.3) 18%, rgba(130, 130, 130, 0.2) 33%)`,
  animation: `${skeleton_keyframes} 2s ease-in-out infinite`,
}

export const DefaultAnchor = styled('a', {
  color: 'inherit',
  textDecoration: 'none',
  cursor: 'pointer',
})