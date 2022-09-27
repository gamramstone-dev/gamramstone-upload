import { AnimateSharedLayout } from 'framer-motion'
import { NextPage } from 'next'
import Link from 'next/link'
import useSWR from 'swr'
import Container from '../components/common/Container'
import Content from '../components/common/Content'
import ChannelCard from '../components/sets/ChannelCard'
import { APIFetcher } from '../structs/api/base'
import { Channel } from '../structs/api/channels'
import { DefaultAnchor, styled } from '../structs/styles'

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

  if (isLoading) {
    return (
      <ChannelGrid>
        {Array.from({ length: 8 }).map((_, i) => (
          <ChannelCard.Skeleton key={`cs-skeleton-${i}`}></ChannelCard.Skeleton>
        ))}
      </ChannelGrid>
    )
  }

  return (
    <ChannelGrid>
      {data &&
        data.map(channel => (
          <Link key={`channel-${channel.id}`} href={`/channel/${channel.id}`}>
            <DefaultAnchor>
              <ChannelCard.Card channel={channel}></ChannelCard.Card>
            </DefaultAnchor>
          </Link>
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
            marginTop: 65,
            marginBottom: 65,
          }}
        >
          <Text>왁타버스, 이세계 아이돌 채널 번역 프로젝트</Text>
          <Text
            css={{
              color: '$gamramstone',
            }}
          >
            감람스톤
          </Text>
        </Container>
        <AnimateSharedLayout>
          <Channels></Channels>
        </AnimateSharedLayout>
      </Container>
    </Content>
  )
}

export default Main
