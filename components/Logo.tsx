import Image from 'next/image'

interface LogoProps {
  size?: number
  stroke?: number
}

export const Logo = ({ size = 32 }: LogoProps) => {
  return (
    <Image
      src='/logo.png'
      width={size}
      height={size * 1.13664596}
      alt='감람스톤 로고'
    ></Image>
  )
}

export default Logo
