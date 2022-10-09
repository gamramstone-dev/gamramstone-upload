import { VariantProps } from '@stitches/react'
import { useReducedMotion } from 'framer-motion'
import { ReactNode, useRef } from 'react'

import { AriaButtonProps, useButton } from 'react-aria'
import { CSS, styled } from '../../structs/styles'

const ButtonElement = styled('button', {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,

  background: 'var(--button-background, #000)',
  color: 'var(--button-color, #fff)',
  outline: 'none',
  border: 'none',

  '&::after': {
    content: '""',
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 'inherit',
    boxShadow: '0 0 0 2px var(--button-background, #000)',

    transition: 'opacity 0.12s cubic-bezier(0.19, 0, 0.22, 1)',
  },

  cursor: 'pointer',
  transition:
    'background 0.12s cubic-bezier(0.19, 0, 0.22, 1), opacity 0.12s cubic-bezier(0.19, 0, 0.22, 1), box-shadow 0.12s cubic-bezier(0.19, 0, 0.22, 1)',

  '&:hover': {
    background: 'var(--button-background-hover, #222)',
  },

  '&:focus': {
    outline: 0,
    background: 'var(--button-background-hover, #222)',

    '&::after': {
      opacity: 0.3,
    },
  },

  '&:focus-visible': {
    outline: 'none !important',
    // boxShadow: '0 0 0 2px var(--button-color, #000) inset',
  },

  variants: {
    pressed: {
      true: {
        background: 'var(--button-background-active, #555) !important',
      },
    },
    disabled: {
      true: {
        cursor: 'not-allowed',
        background: 'var(--button-background-disabled, #777) !important',
        opacity: 0.5,
      },
    },
    reduceMotion: {
      true: {
        transition: 'none',
      },
    },
    size: {
      small: {
        fontSize: '0.8em',
        padding: '6px 8px',
        borderRadius: 4,
      },
      medium: {
        fontSize: '0.9em',
        padding: '10px 16px',
        borderRadius: 8,
      },
      large: {
        fontSize: '1em',
        padding: '14px 24px',
        borderRadius: 12,
      },
      fill: {
        fontSize: '0.9em',
        width: '100%',
        padding: '10px 16px',
      },
    },
    theme: {
      primary: {
        '--button-color': '#fff',
        '--button-background': '$primary',
        '--button-background-hover': '$primary',
        '--button-background-active': '$primary',
        '--button-background-disabled': '$primary',
      },
      secondary: {
        '--button-color': '#000',
        '--button-background': '#f5f5f5',
        '--button-background-hover': '#e0e0e0',
        '--button-background-active': '#cecece',
        '--button-background-disabled': '#b0b0b0',
      },
      transparent: {
        '--button-color': '#000',
        '--button-background': 'transparent',
        '--button-background-hover': 'rgba(0, 0, 0, 0.05)',
        '--button-background-active': 'rgba(0, 0, 0, 0.1)',
        '--button-background-disabled': 'rgba(0, 0, 0, 0.2)',
      },
    },
  },
})

export type ButtonSize = VariantProps<typeof ButtonElement>['size']
export type ButtonTheme = VariantProps<typeof ButtonElement>['theme']

export type ButtonProps = AriaButtonProps & {
  children: ReactNode
  size?: ButtonSize
  theme?: ButtonTheme
  css?: CSS
}

export const Button = ({
  children,
  theme = 'primary',
  size = 'medium',
  ...props
}: ButtonProps) => {
  let ref = useRef<HTMLButtonElement>(null)
  let { buttonProps, isPressed } = useButton(props, ref)
  const shouldReduceMotion = useReducedMotion()

  return (
    <ButtonElement
      {...buttonProps}
      css={props.css}
      theme={theme}
      size={size}
      ref={ref}
      pressed={isPressed}
      disabled={props.isDisabled}
      reduceMotion={shouldReduceMotion ?? false}
    >
      {children}
    </ButtonElement>
  )
}

export default Button
