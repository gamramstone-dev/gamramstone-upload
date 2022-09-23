import { NextPage } from 'next'
import Button from '../components/common/Button'

const Main: NextPage = () => {
  return (
    <>
      <Button icon='pencil-line' size='small'>Hello</Button>
      <Button icon='pencil-line'>Hello</Button>
      <Button icon='pencil-line' size='large'>Hello</Button>
    </>
  )
}

export default Main
