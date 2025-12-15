/**
 * 순수 함수: 속성값으로 필터링
 */
export const filterByProperty = <T, K extends keyof T>(items: T[], key: K, value: T[K]): T[] =>
  items.filter((item) => item[key] === value)

/**
 * 순수 함수: 완료된 항목 필터링
 */
export const filterCompleted = <T extends { completed: boolean }>(items: T[]): T[] =>
  items.filter((item) => item.completed)

/**
 * 순수 함수: 미완료 항목 필터링
 */
export const filterIncomplete = <T extends { completed: boolean }>(items: T[]): T[] =>
  items.filter((item) => !item.completed)

/**
 * 고차 함수: 커스텀 필터 생성
 */
export const createFilter =
  <T>(predicate: (item: T) => boolean) =>
  (items: T[]): T[] =>
    items.filter(predicate)

