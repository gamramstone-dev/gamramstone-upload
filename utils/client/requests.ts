import { CaptionFile, LanguageCode } from '../../structs/airtable'
import {
  updateYouTubeTitleMetadata,
  uploadYouTubeCaption,
  validateAccessToken,
} from '../youtube'

import toast from 'react-hot-toast'
import { Session } from 'next-auth'

/**
 * YouTube API를 활용하여 영상 제목, 세부 정보, 자막을 모두 업로드 합니다.
 * @param token API Token
 * @param language 자막 언어
 * @param id YouTube 영상 ID
 * @param title 영상 제목
 * @param description 영상 세부 정보
 * @param captions 자막 파일 목록
 * @returns
 */
export const applyCaptions = async (
  token: string | undefined,
  language: LanguageCode,
  id: string,
  title: string,
  description: string,
  captions?: CaptionFile[] | null
): Promise<void> => {
  if (typeof token !== 'string') {
    throw new Error('로그인이 안되어 있어요.')
  }

  const tokenResult = await validateAccessToken(token)

  if (!tokenResult) {
    throw new Error('토큰이 올바르지 않습니다.')
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
    throw new Error(`제목 업데이트 오류 : ${(e as Error).message}`)
  }

  if (!captions) {
    return
  }

  try {
    for (let i = 0; i < captions.length; i++) {
      // TODO : 여러 파일이 있을 경우 업로드할 파일 선택할 수 있도록 만들기
      // 현재는 첫 번째 캡션만 업로드할 수 있도록 지정했습니다.
      //
      // Update 2022-03-09: 아직까지는 여러 파일이 있는 경우가 없어서 무기한 보류합니다.
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
    throw new Error(`자막 파일 업로드 오류 : ${(e as Error).message}`)
  }
}

/**
 * session 정보를 가져와서 업로드 가능한 상태인지 판별합니다.
 * 업로드가 가능하면 func를, 불가능하면 authFunc를 실행합니다.
 * @param session 
 * @param func 
 * @param authFunc 
 * @returns 
 */
export const isUploadable = (
  session: Session | null,
  func: () => void,
  authFunc?: () => void
) => {
  if (!session) {
    if (authFunc) {
      authFunc()
    }

    return
  }

  if (!session?.permissionGranted) {
    if (authFunc) {
      authFunc()

      return
    }

    toast.error(
      'YouTube 연동이 필요해요. 프로필 페이지에서 연동하기 버튼을 클릭해주세요.'
    )

    return
  }

  func()
}

/**
 * 영상의 업로드 상태를 변경합니다. 로그인 상태여야 하고, 관리자 권한이나 크리에이터 권한이 있어야 작동합니다.
 * @param lang 영상 언어
 * @param videos 영상 ID 목록
 * @param isTest 테스트 여부
 * @returns
 */
export const updateVideoState = (
  lang: LanguageCode,
  videos: string[],
  isTest?: boolean
) => {
  return fetch(
    `/api/airtable/updateVideo?lang=${lang}&videos=${videos.join(
      ','
    )}&isTest=${isTest}`,
    {
      method: 'PATCH',
    }
  )
}
