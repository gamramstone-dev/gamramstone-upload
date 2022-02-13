import Image from 'next/image'
import styles from '../styles/components/VideoCard.module.scss'

interface VideoCardProps {
  title: string
  youtubeId: string
}

export const VideoCard = ({
  title,
  youtubeId
}: VideoCardProps) => {
  return <div className={styles.videoCard}>
    <div className={styles.thumbnail}>
      <Image src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`} alt='YouTube 썸네일' layout='fill' />
    </div>
    <div className={styles.metadata}>
      <div className={styles.title}>
        <h3>{title}</h3>
      </div>
    </div>
  </div>
}

export default VideoCard