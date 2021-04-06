/******************************************************
 * Created by nanyuantingfeng on 2018-11-29 11:02.
 *****************************************************/
import { SyncParallelHook, AsyncParallelHook, SyncSeriesHook, AsyncSeriesHook, Hook } from '@ekuaibao/hooks'

export default class Hooks {
  onready = new AsyncParallelHook()
  onafter = new AsyncParallelHook()

  onfirst = new AsyncSeriesHook()
  onload = new SyncSeriesHook()
  others = new SyncParallelHook()
  onuse = new SyncSeriesHook()

  reg<T>(name: string, fn: (...args: any) => T) {
    this.get(name).add(fn)
    return this
  }

  private get(name: string): Hook {
    // @ts-ignore
    return this[name] ? this[name] : this.others
  }
}
