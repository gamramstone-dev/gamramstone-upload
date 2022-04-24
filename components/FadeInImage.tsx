import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { classes } from '../utils/string'

import styles from '../styles/components/FadeInImage.module.scss'

export const FadeInImage = (props: Omit<ImageProps, 'onLoad'>) => {
  const [load, setLoaded] = useState<boolean>(false)

  return (
    <Image
      {...props}
      src={props.src}
      className={classes(
        props.className,
        styles.imageFadeIn,
        load && styles.loaded
      )}
      alt={props.alt}
      onLoadingComplete={() => setLoaded(true)}
    ></Image>
  )
}

export default FadeInImage
