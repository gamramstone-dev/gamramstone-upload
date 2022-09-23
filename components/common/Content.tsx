import { ReactNode } from 'react'
import { styled } from '../../structs/styles'

const ContentElement = styled('div', {
  position: 'relative',

  width: '85%',
  left: '7.5%',

  '@mobile': {
    width: '95%',
    left: '2.5%',
  },

  variants: {
    start: {
      true: {
        top: '15vh',
      },
    },
  },
})

interface ContentProps {
  children: ReactNode
  start?: boolean
}

export const Content = ({ children, start }: ContentProps) => {
  return <ContentElement start={start}>{children}</ContentElement>
}

export default Content
