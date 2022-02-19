import { useEffect, useState } from "react";

/**
 * 브라우저 가로 크기가 주어진 크기를 넘는지 감지하는 Hook입니다.
 * 서비리스 환경에서는 항상 false를 반환합니다.
 * @param threshold 활성화 기준 가로 크기
 * @returns {boolean} 브라우저 가로 크기가 threshold 값 이상이면 true, 아니면 false
 */
export const useDeviceWidthLimiter = (threshold: number) => {
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    if (!process.browser) {
      return;
    }

    const query = window.matchMedia(`screen and (max-width: ${threshold}px)`);
    const resizeHandler = (ev: MediaQueryListEvent) => setActive(ev.matches);
    query.addEventListener('change', resizeHandler);

    setActive(query.matches);
  }, [threshold]);

  return active;
};