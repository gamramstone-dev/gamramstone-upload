import { NextPage } from 'next'
import useSWR from 'swr'
import Container from '../components/common/Container'
import Content from '../components/common/Content'
import ChannelCard from '../components/sets/ChannelCard'
import { APIFetcher } from '../structs/api/base'
import { Channel } from '../structs/api/channels'
import { styled } from '../structs/styles'

const Text = styled('h3', {
  fontSize: '1.75em',
  margin: 0,
  letterSpacing: -0.5,
  fontWeight: 700,
  lineHeight: 1,
})

const ChannelGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(300px, 1fr))',
  gap: 16,

  '@tablet': {
    gridTemplateColumns: 'repeat(2, minmax(300px, 1fr))',
  },

  '@mobile': {
    gridTemplateColumns: 'repeat(1, minmax(300px, 1fr))',
  },
})

const Channels = () => {
  const { data, isLoading } = useSWR<Channel[]>('/channels', APIFetcher)

  return (
    <ChannelGrid>
      {data &&
        data.map(channel => (
          <ChannelCard
            key={`channel-${channel.id}`}
            channel={channel.name}
          ></ChannelCard>
        ))}
    </ChannelGrid>
  )
}

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
            gap: 8,
            flexDirection: 'column',
          }}
        >
          <Text>왁타버스, 이세계 아이돌 채널 번역 프로젝트</Text>
          <Text>감람스톤</Text>
        </Container>
        <Channels></Channels>
      </Container>
    </Content>
  )
}

export default Main
