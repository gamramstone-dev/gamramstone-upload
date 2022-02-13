import { useCallback, useRef } from "react";

/**
 * Debounce를 구현하는 Debouncer입니다.
 * @param func 실행할 함수
 * @param delay 지연시간
 * @returns [Debounce가 적용된 함수, Debounce를 취소하는 함수]
 */
 export const useDebouncer = <T extends (...args: any[]) => unknown>(
  func: T,
  delay: number
): [(...args: Parameters<T>) => void, () => void] => {
  const timeout = useRef<number>(0);

  const cancel = useCallback(() => {
    clearTimeout(timeout.current);
  }, []);

  const run = useCallback(
    (...args: Parameters<T>) => {
      if (timeout.current) {
        cancel();
      }

      timeout.current = (setTimeout(() => {
        func(...args);
      }, delay) as unknown) as number;
    },
    [delay, cancel, func]
  );

  return [run, cancel];
};
