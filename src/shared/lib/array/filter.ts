export const filterByProperty = <T, K extends keyof T>(items: T[], key: K, value: T[K]): T[] =>
  items.filter((item) => item[key] === value)

export const filterCompleted = <T extends { completed: boolean }>(items: T[]): T[] =>
  items.filter((item) => item.completed)

export const filterIncomplete = <T extends { completed: boolean }>(items: T[]): T[] =>
  items.filter((item) => !item.completed)

export const createFilter =
  <T>(predicate: (item: T) => boolean) =>
  (items: T[]): T[] =>
    items.filter(predicate)
