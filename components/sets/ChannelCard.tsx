import Image from 'next/image'
import { Channel } from '../../structs/api/channels'
import { skeleton, styled } from '../../structs/styles'
import { getPastelColor } from '../../utils/colors'

import { motion } from 'framer-motion'
import { CSSProperties } from 'react'

const CardElement = styled('div', {
  position: 'relative',
  borderRadius: 8,

  textDecoration: 'none',

  // boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.25)',
  background: '#f4f4f4',
  display: 'flex',

  minHeight: 250,

  '&:hover': {
    '.background': {
      backgroundColor: 'var(--hover)',
    },

    '.channel .name': {
      color: 'white',
    },
  },

  '.background': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 8,
    transition: 'background-color 0.2s cubic-bezier(0.19, 0, 0.22, 1)',

    backgroundColor: 'var(--background)',

    // background: 'rgba(0,0,0,0.2)',
  },

  '&:hover .channel': {
    transform: 'scale(1.1)',
  },

  '.channel': {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    gap: 16,
    margin: 'auto',

    transition: 'transform cubic-bezier(0.19, 1, 0.22, 1) 0.23s',

    '.thumbnail': {
      position: 'relative',
      borderRadius: '50%',
      overflow: 'hidden',
      width: 90,
      height: 90,
      boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.25)',
      alignSelf: 'center',
    },

    '.name': {
      fontSize: '1.05em',
      fontWeight: 700,
      letterSpacing: -0.5,
      lineHeight: 1,
      alignSelf: 'center',
      color: 'black',
      transition: 'color 0.2s cubic-bezier(0.19, 0, 0.22, 1)',

      // textShadow: '0px 0px 8px rgba(0, 0, 0, 0.25)',
    },
  },

  variants: {
    skeleton: {
      true: {
        background: skeleton.background,
        boxShadow: 'none',
        backgroundSize: `200% 100%`,
        animation: skeleton.animation,
      },
    },
  },
})

interface ChannelCardProps {
  channel: Channel
}

export const ChannelCard = ({ channel }: ChannelCardProps) => {
  return (
    <CardElement>
      {channel.color && (
        <div
          className='background'
          style={
            {
              '--background': getPastelColor(channel.color, 0.9),
              '--hover': getPastelColor(channel.color, 0.5),
            } as CSSProperties
          }
        ></div>
      )}

      <div className='channel'>
        <div className='thumbnail'>
          <Image
            src={channel.thumbnail}
            width={90}
            height={90}
            alt={`${channel.name} 채널 이미지`}
          />
        </div>
        <div className='name'>{channel.name}</div>
      </div>
    </CardElement>
  )
}

const Skeleton = () => {
  return <CardElement skeleton></CardElement>
}

const exports = {
  Card: ChannelCard,
  Skeleton,
}

export default exports
