import Image from 'next/image'
import styles from '../styles/components/VideoCard.module.scss'

interface VideoCardProps {
  youtubeId: string
}

export const VideoCard = ({
  youtubeId
}: VideoCardProps) => {
  return <div className={styles.videoCard}>
    <div className={styles.thumbnail}>
      <Image src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`} alt='YouTube 썸네일' />
    </div>
  </div>
}

export default VideoCard