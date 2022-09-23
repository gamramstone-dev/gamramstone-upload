import { VariantProps } from '@stitches/react'
import { ReactNode, useRef } from 'react'
import { useButton } from 'react-aria'
import { styled } from '../../structs/styles'

const ButtonElement = styled('button', {
  borderRadius: '8px',
  outline: 'none',
  border: 'none',
  letterSpacing: '-0.5px',

  transition: '0.23s opacity cubic-bezier(0.19, 1, 0.22, 1)',
  cursor: 'pointer',
  display: 'flex',
  gap: '8px',

  '&:hover': {
    opacity: 0.9,
  },

  '&:focus': {
    outline: 'none',

    opacity: 0.9,
    boxShadow: '0px 0px 2px white inset',
  },

  '& > *': {
    margin: 'auto',
  },

  variants: {
    pressed: {
      true: {
        opacity: '0.8 !important',
      },

      false: {},
    },

    size: {
      small: {
        fontSize: '0.9em',
        padding: '10px 20px',
      },

      medium: {
        fontSize: '1em',
        padding: '12px 24px',
      },

      large: {
        fontSize: '1.1em',
        padding: '14px 28px',
      },
    },

    theme: {
      primary: {
        backgroundColor: '$primary',
        color: '#fff',
      },
    },
  },
})

interface ButtonProps {
  children: ReactNode
  icon?: string

  size?: VariantProps<typeof ButtonElement>['size']
  theme?: VariantProps<typeof ButtonElement>['theme']

  onClick?: () => void
}

export const Button = ({
  children,
  icon,
  size = 'medium',
  theme = 'primary',
  onClick,
}: ButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null)

  const { buttonProps, isPressed } = useButton(
    {
      onPress: onClick,
    },
    ref
  )

  return (
    <ButtonElement
      ref={ref}
      {...buttonProps}
      theme={theme}
      size={size}
      pressed={isPressed}
    >
      {typeof icon === 'string' && <i className={`ri-${icon}`}></i>}
      {children}
    </ButtonElement>
  )
}

export default Button
