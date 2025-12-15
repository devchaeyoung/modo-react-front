/**
 * Maybe Monad: null/undefined 안전 처리
 * @example
 * Maybe.of(user)
 *   .map(u => u.address)
 *   .map(a => a.city)
 *   .getOrElse('Unknown')
 */
export class Maybe<T> {
  private value: T | null | undefined
  private constructor(value: T | null | undefined) {
    this.value = value
  }

  static of<T>(value: T | null | undefined): Maybe<T> {
    return new Maybe(value)
  }

  map<R>(fn: (value: T) => R): Maybe<R> {
    return this.value == null ? (Maybe.of(null) as Maybe<R>) : Maybe.of(fn(this.value))
  }

  flatMap<R>(fn: (value: T) => Maybe<R>): Maybe<R> {
    return this.value == null ? (Maybe.of(null) as Maybe<R>) : fn(this.value)
  }

  getOrElse(defaultValue: T): T {
    return this.value ?? defaultValue
  }

  isNothing(): boolean {
    return this.value == null
  }
}

