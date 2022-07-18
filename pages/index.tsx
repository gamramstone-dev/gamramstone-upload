import { NextPage } from 'next'
import Head from 'next/head'

import pageStyles from '../styles/page.module.scss'
import styles from '../styles/pages/Main.module.scss'
import { classes } from '../utils/string'
import Logo from '../components/Logo'
import { Channel, ChannelID, Channels } from '../structs/channels'
import Link from 'next/link'
import FadeInImage from '../components/FadeInImage'
import Footer from '../components/Footer'
import { useTranslation } from 'react-i18next'

interface ChannelCardProps {
  channel: Channel
}

const ChannelCard = ({ channel }: ChannelCardProps) => {
  return (
    <div className={styles.card} data-id={channel.id}>
      <div className={styles.cardContents}>
        <div className={styles.image}>
          <FadeInImage
            src={channel.image}
            alt={channel.name}
            unoptimized
            width={200}
            height={200}
          />
        </div>
        <div className={styles.name}>
          <p>{channel.name}</p>
        </div>
      </div>
    </div>
  )
}

const Main: NextPage = () => {
  const {t} = useTranslation()

  return (
    <div className={styles.container}>
      <Head>
        <title>{t('gamramstone')}</title>
      </Head>
      <div className={pageStyles.page}>
        <div className={classes(pageStyles.contents, styles.heading)}>
          <div className={styles.inner}>
            <span>{t('project_title')}</span>
            <div className={styles.logo}>
              <Logo size={32} stroke={3}></Logo>
              <span>{t('gamramstone')}</span>
            </div>
          </div>
        </div>
        <div className={classes(pageStyles.contents, styles.channels)}>
          {(Object.keys(Channels) as ChannelID[]).map(channel => (
            <Link key={channel} href={`/channel/${channel}`} passHref>
              <a>
                <ChannelCard channel={Channels[channel]}></ChannelCard>
              </a>
            </Link>
          ))}
        </div>
      </div>
      <Footer></Footer>
    </div>
  )
}

export default Main
