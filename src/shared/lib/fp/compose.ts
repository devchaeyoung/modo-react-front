/**
 * 순수 함수: 오른쪽에서 왼쪽으로 함수 조합
 * @example compose(subtract3, multiply2, add1)(5) // ((5 + 1) * 2) - 3 = 9
 */
export const compose =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T =>
    fns.reduceRight((acc, fn) => fn(acc), value)
