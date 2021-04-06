/******************************************************
 * Created by nanyuantingfeng on 2018-11-28 17:14.
 *****************************************************/
import { memoize, isNumber } from '@ekuaibao/helpers'

const mapper = new Map<string, (...args: any[]) => Promise<any>>()

export default function<T = any>(id: string, maxAge: number, fn: (...args: any[]) => Promise<T>) {
  if (!isNumber(maxAge) || maxAge <= 0) {
    return fn
  }

  const key = `${id}::${maxAge}`
  if (!mapper.has(key)) {
    const fn2 = memoize(fn, { maxAge })
    mapper.set(key, fn2)
    return fn2
  }

  return mapper.get(key)
}
