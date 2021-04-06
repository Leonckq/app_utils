/***************************************************
 * Created by nanyuantingfeng on 2020/3/23 13:00. *
 ***************************************************/

export interface Lazy<T> {
  (): T
  then<U>(modifier: (a: T) => Lazy<U>): Lazy<U>
  map<U>(mapper: (a: T) => U): Lazy<U>
  isLazy: boolean
  isExecuted: boolean
  value: T
}

export const lazy = <T>(executor: () => T): Lazy<T> => {
  let _value: T = null
  let oo: Lazy<T>

  oo = <Lazy<T>>function(): T {
    if (oo.isExecuted) return _value
    _value = executor.apply(this, arguments)
    oo.isExecuted = true
    return _value
  }

  oo.isLazy = true
  oo.isExecuted = false

  oo.then = <U>(modifier: (lz: T) => Lazy<U>): Lazy<U> => modifier(oo())
  oo.map = <U>(mapper: (lz: T) => U): Lazy<U> => lazy(() => mapper(oo()))

  Object.defineProperty(oo, 'value', {
    configurable: false,
    enumerable: false,
    get: () => (oo.isExecuted ? _value : oo())
  })

  return oo
}

export default lazy
