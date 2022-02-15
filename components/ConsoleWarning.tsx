import { useEffect } from "react"

export const ConsoleWarning = () => {
  useEffect(() => {
    console.log(`%c잠깐! 해킹 검지검지~`, `font-size:64px;color:red;font-weight:bold;`)
    console.log(`%c이 창에 절대 아무 것도 입력하지 마세요. 심지어 개발자가 요청하더라도요!`, `font-size:16px;color:orange;font-weight:bold;`)
  }, [])

  return <></>
}

export default ConsoleWarning