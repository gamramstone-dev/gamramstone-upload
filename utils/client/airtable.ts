import { VideoWorks } from "../../structs/airtable"
import { groupBy } from "../commmon"

/**
 * failed에 있지 않은 영상들을 'lang'으로 묶어 반환합니다. (works-failed)
 *
 * ```
 * const videos = extractFinishedVideosByLanguage(
 *   [
 *     {id: 'a', lang: 'ko'},
 *     {id: 'b', lang: 'ko'},
 *     {id: 'c', lang: 'en'},
 *   ],
 *   [
 *     {id: 'b', lang: 'ko'},
 *   ]
 * ) // => {'ko': [{id: 'a', lang: 'ko'}], 'en': [{id: 'c', lang: 'en'}]}
 * ```
 *
 * @param works
 * @param failed
 */
export const extractFinishedVideosByLanguage = (
  works: VideoWorks[],
  failed: VideoWorks[]
) => {
  const done = works.filter(v => {
    for (let i = 0; i < failed.length; i++) {
      if (failed[i].id === v.id) {
        return false
      }
    }

    return true
  })

  return groupBy(done, video => video.lang)
}