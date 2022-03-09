/**
 * 배열을 size 만큼 잘라서 토백냅니다.
 * @param array 배열
 * @param size 한 토막의 크기
 * @returns 
 */
export const chunks = (array: any[], size: number) =>
  array.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(array.slice(i, i + size))
    return acc
  }, [])
