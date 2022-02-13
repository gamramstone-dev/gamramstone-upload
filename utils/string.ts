/**
 * 여러 className을 하나의 CSS className으로 묶어주는 함수.
 *
 * false나 undefined나 주어지는 경우에는 무시합니다.
 *
 * @param classNames 합쳐질 className
 * @returns 합쳐진 className
 */
 export const classes = (...classNames: (string | boolean | undefined)[]) =>
 classNames.filter((v) => typeof v === 'string').join(' ');
