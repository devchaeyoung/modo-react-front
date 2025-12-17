export const groupBy = <T, K extends keyof T>(items: T[], key: K): Record<string, T[]> => {
  return items.reduce(
    (acc, item) => {
      const groupKey = String(item[key])
      return {
        ...acc,
        [groupKey]: [...(acc[groupKey] || []), item],
      }
    },
    {} as Record<string, T[]>
  )
}

export const createGrouper =
  <T>(keyFn: (item: T) => string) =>
  (items: T[]): Record<string, T[]> => {
    return items.reduce(
      (acc, item) => {
        const groupKey = keyFn(item)
        return {
          ...acc,
          [groupKey]: [...(acc[groupKey] || []), item],
        }
      },
      {} as Record<string, T[]>
    )
  }
