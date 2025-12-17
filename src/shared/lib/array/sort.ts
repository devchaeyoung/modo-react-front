export const sortByOrder = <T extends { order: number }>(items: T[]): T[] =>
  [...items].sort((a, b) => a.order - b.order)

export const sortByDate = <T extends { createdAt: Date }>(
  items: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] => {
  return [...items].sort((a, b) => {
    const timeA = a.createdAt.getTime()
    const timeB = b.createdAt.getTime()
    return order === 'desc' ? timeB - timeA : timeA - timeB
  })
}

export const createSorter =
  <T, K extends keyof T>(key: K, order: 'asc' | 'desc' = 'asc') =>
  (items: T[]): T[] =>
    [...items].sort((a, b) => {
      const valueA = a[key]
      const valueB = b[key]
      if (valueA < valueB) return order === 'asc' ? -1 : 1
      if (valueA > valueB) return order === 'asc' ? 1 : -1
      return 0
    })
