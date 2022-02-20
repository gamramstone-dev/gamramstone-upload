import { CaptionFile, LanguageCode } from '../structs/airtable'
import {
  updateYouTubeTitleMetadata,
  uploadYouTubeCaption,
  validateAccessToken,
} from './youtube'

export const applyCaptions = async (
  token: string,
  language: LanguageCode,
  id: string,
  title: string,
  description: string,
  captions?: CaptionFile[] | null
) => {
  if (typeof token !== 'string') {
    throw new Error('로그인이 안되어 있어요. ')
  }

  const tokenResult = await validateAccessToken(token)

  if (!tokenResult) {
    throw new Error()
  }

  try {
    const metadataResult = await updateYouTubeTitleMetadata(id, token, {
      [language]: {
        title,
        description,
      },
    })

    if (!metadataResult) {
      throw new Error('영상 메타데이터 업로드 결과가 없어요.')
    }
  } catch (e) {
    throw new Error(
      `영상 제목 / 설명을 업데이트하는 도중에 오류가 발생했어요. ${
        (e as Error).message
      }`
    )
  }

  if (!captions) {
    return
  }

  try {
    for (let i = 0; i < captions.length; i++) {
      // TODO : 여러 파일이 있을 경우 업로드할 파일 선택할 수 있도록 만들기
      // 현재는 첫 번째 캡션만 업로드할 수 있도록 지정했습니다.
      if (captions.length > 1 && i >= 1) {
        break
      }

      const caption = captions[i]

      const file = await fetch(caption.url).then(v => v.blob())

      const result = await uploadYouTubeCaption(
        id,
        token,
        language,
        file
        // extractCaptionTrackName(caption.filename)
        // TODO : 자막 이름들이 좀 정렬되면 extractCaptionTrackName 사용
      )

      if (!result) {
        throw new Error('자막 파일 업로드 결과가 없어요.')
      }
    }
  } catch (e) {
    throw new Error(
      `영상 자막 파일을 업로드 하는 도중에 오류가 발생하였습니다: ${
        (e as Error).message
      }`
    )
  }
}
