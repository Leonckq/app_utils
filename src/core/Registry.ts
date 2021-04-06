/******************************************************
 * Created by nanyuantingfeng on 2018/7/10 17:32.
 *****************************************************/
import { topologicalSort, DeptsMap } from '@ekuaibao/helpers'

export default class Registry {
  private deptsMap: DeptsMap = new Map()

  private weakDeptsMap: DeptsMap = new Map()

  addDepts(targetId: string, depts: string | string[]): this {
    return this.add(this.deptsMap, targetId, depts)
  }

  addWeakDepts(targetId: string, depts: string | string[]): this {
    return this.add(this.weakDeptsMap, targetId, depts)
  }

  getWeakOne(targetId: string): string[] {
    return topologicalSort(this.weakDeptsMap, targetId)
  }

  getOne(targetId: string): string[] {
    return topologicalSort(this.deptsMap, targetId)
  }

  getOneWithoutSelf(targetId: string): string[] {
    const ids = this.getOne(targetId)
    return ids.filter(id => id !== targetId)
  }

  getWeakOneWithoutSelf(targetId: string): string[] {
    const ids = this.getWeakOne(targetId)
    return ids.filter(id => id !== targetId)
  }

  private add(map: DeptsMap, targetId: string, depts: string | string[]): this {
    if (!map.has(targetId)) {
      map.set(targetId, [])
    }

    if (!Array.isArray(depts)) {
      depts = [depts]
    }

    const array = map.get(targetId) as string[]
    array.push(...depts)
    map.set(targetId, array)
    return this
  }
}
