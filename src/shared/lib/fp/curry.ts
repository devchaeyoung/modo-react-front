/**
 * 고차 함수: 커링 (부분 적용)
 * @example
 * const add = (a: number, b: number) => a + b
 * const curriedAdd = curry(add)
 * curriedAdd(1)(2) // 3
 */
export const curry = <T extends any[], R>(fn: (...args: T) => R) => {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...(args as T))
    }
    return (...nextArgs: any[]) => curried(...args, ...nextArgs)
  }
}

