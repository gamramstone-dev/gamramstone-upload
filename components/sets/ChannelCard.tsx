import Image from 'next/future/image'
import { styled } from '../../structs/styles'

const CardElement = styled('div', {
  position: 'relative',
  borderRadius: 8,

  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.25)',
  background: '$primary',

  minHeight: 200,

  '.background': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  '.content': {
    position: 'relative',
    bottom: 0,
    width: '100%',
    minHeight: 75,

    background: 'rgba(0, 0, 0, 0.25)',

    backdropFilter: 'blur(8px)',
  },
})

interface ChannelCardProps {
  channel: string
}

export const ChannelCard = ({ channel }: ChannelCardProps) => {
  return (
    <CardElement>
      <div className='background'></div>
      <div className='content'>{channel}</div>
    </CardElement>
  )
}

export default ChannelCard
