/******************************************************
 * Created by nanyuantingfeng on 2018/9/4 12:36.
 *****************************************************/
type OneLevelMap<T> = Map<string, T[]>
type TwoLevelMap<T> = Map<string, Map<string, T[]>>

function values(obj: any): any[] {
  if (obj.values) {
    return Array.from(obj.values())
  }
  return Object.keys(obj).map(k => obj[k])
}

export default class PointCellar<T> {
  cache: OneLevelMap<T> = new Map()
  cacheNS: TwoLevelMap<T> = new Map()

  has(key: string, namespace?: string): boolean {
    if (!namespace) {
      return this.cache.has(key) || this.cacheNS.has(key)
    }

    if (this.cacheNS.has(key)) {
      const oo = this.cacheNS.get(key)
      return oo.has(namespace)
    }

    return this.cacheNS.has(key) && this.cacheNS.get(key).has(namespace)
  }

  get(key: string, namespace?: string): T[] {
    const cachedata = this.cache.get(key)

    if (!namespace) {
      if (!this.cacheNS.has(key)) {
        return values(cachedata)
      }
      const dd = this.cacheNS.get(key)
      return values(cachedata).concat(...values(dd))
    }

    if (this.has(key, namespace)) {
      return this.cacheNS.get(key).get(namespace)
    }

    return values(cachedata)
  }

  push(key: string, value: T, namespace?: string) {
    if (!namespace) {
      const dd = this.cache.get(key) || []
      dd.push(value)
      this.cache.set(key, dd)
      return
    }

    if (!this.cacheNS.has(key)) {
      this.cacheNS.set(key, new Map())
    }

    const oo = this.cacheNS.get(key)
    const dd = oo.get(namespace) || []
    dd.push(value)
    oo.set(namespace, dd)
  }

  pushNS(key: string, namespace: string, value: T) {
    return this.push(key, value, namespace)
  }

  pushList(key: string, values: T[], namespace?: string) {
    if (!namespace) {
      const dd = this.cache.get(key) || []
      dd.push(...values)
      this.cache.set(key, dd)
      return
    }

    if (!this.cacheNS.has(key)) {
      this.cacheNS.set(key, new Map())
    }

    const oo = this.cacheNS.get(key)
    const dd = oo.get(namespace) || []
    dd.push(...values)
    oo.set(namespace, dd)
  }

  pushNSList(key: string, namespace: string, value: T[]) {
    return this.pushList(key, value, namespace)
  }

  set(key: string, value: T, namespace?: string) {
    if (!namespace) {
      this.cache.set(key, [value])
      return
    }

    if (!this.cacheNS.has(key)) {
      this.cacheNS.set(key, new Map())
    }

    this.cacheNS.get(key).set(namespace, [value])
  }

  setNS(key: string, namespace: string, value: T) {
    return this.set(key, value, namespace)
  }

  setList(key: string, values: T[], namespace?: string) {
    if (!namespace) {
      this.cache.set(key, values)
      return
    }

    if (!this.cacheNS.has(key)) {
      this.cacheNS.set(key, new Map())
    }

    this.cacheNS.get(key).set(namespace, values)
  }

  setNSList(key: string, namespace: string, values: T[]) {
    return this.setList(key, values, namespace)
  }

  clearNS(key: string, namespace?: string) {
    if (namespace) {
      this.cacheNS.get(key).delete(namespace)
      return
    }

    this.cacheNS.delete(key)
  }

  clearGB(key: string) {
    this.cache.clear()
  }

  clearAll(key?: string) {
    if (key) {
      this.clearGB(key)
      this.clearNS(key)
      return
    }
    this.cache.clear()
    this.cacheNS.clear()
  }
}
