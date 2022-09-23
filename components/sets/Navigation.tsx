import Button from '../common/Button'
import Container from '../common/Container'

import { useSession } from 'next-auth/react'
import { ReactNode } from 'react'
import Link from 'next/link'

const Bar = ({ children }: { children: ReactNode }) => {
  return (
    <Container
      css={{
        zIndex: 1000,
        position: 'fixed',
        top: 42,
        width: '85%',
        justifyContent: 'space-between',
        left: '7.5%',

        '@mobile': {
          width: '95%',
          left: '2.5%',
        },
      }}
    >
      {children}
    </Container>
  )
}

const Logo = () => {
  return (
    <Container
      css={{
        fontSize: '1em',
        fontWeight: 'bold',
        letterSpacing: '-0.5px',
        margin: 0,
        transition: '0.23s opacity cubic-bezier(0.19, 1, 0.22, 1)',
        cursor: 'pointer',

        a: {
          color: 'inherit',
          textDecoration: 'none',
        },

        alignSelf: 'center',

        '&:hover': {
          opacity: 0.8,
        },

        '&:active': {
          opacity: 0.6,
        },
      }}
    >
      <Link href='/'>GAMRAMSTONE</Link>
    </Container>
  )
}

const UserAction = () => {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    // TODO : 로딩 컴포넌트 구현

    return null
  }

  if (!session) {
    return <Button size='small' icon='login-box-line'>로그인</Button>
  }

  return <Button size='small' icon='logout-box-line'>로그아웃</Button>
}

export const Navigation = () => {
  return (
    <Bar>
      <Logo></Logo>
      <UserAction></UserAction>
    </Bar>
  )
}

export default Navigation
