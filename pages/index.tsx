import { NextPage } from 'next'
import Button from '../components/common/Button'
import Container from '../components/common/Container'
import Content from '../components/common/Content'

const Main: NextPage = () => {
  return (
    <Content start>
      <Container
        css={{
          gap: 16,
          flexDirection: 'column',
        }}
      >
        <Container
          css={{
            '& > *': {
              alignSelf: 'center',
            },
          }}
        >
          <Button icon='pencil-line' size='small'>
            Hello
          </Button>
          <Button icon='pencil-line'>Hello</Button>
          <Button icon='pencil-line' size='large'>
            Hello
          </Button>
        </Container>
      </Container>
    </Content>
  )
}

export default Main
