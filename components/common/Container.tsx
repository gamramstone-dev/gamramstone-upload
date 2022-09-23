import { ReactNode } from 'react'
import { CSS, styled } from '../../structs/styles'

const ContainerElement = styled('div', {
  display: 'flex',
  gap: 8,
})

interface ContainerProps {
  children?: ReactNode
  css?: CSS
}

export const Container = ({ children, css }: ContainerProps) => {
  return <ContainerElement css={css}>{children}</ContainerElement>
}

export default Container
