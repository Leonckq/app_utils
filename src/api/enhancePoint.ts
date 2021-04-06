/******************************************************
 * Created by nanyuantingfeng on 2018/9/10 16:44.
 *****************************************************/
import { observable, action, _allowStateChanges } from 'mobx'
import { genReloadPointEventName } from './notifyReloadPoint'
import __app__ from './app'

// 重命名 __app__ 使其不会访问到window.app

type IHandler<T> = (data: any[]) => T | Promise<T>
type IFetch<T> = (sync: (newValue: T[]) => void) => void

function lazyObservable<T>(fetch: IFetch<T>, initialValue: T[]) {
  let started = false
  const value = observable.box(initialValue, { deep: false })
  const load = () => {
    if (!started) {
      started = true
      fetch((newValue: T[]) => _allowStateChanges(true, () => value.set(newValue)))
    }

    return value.get()
  }
  const reset = action('lazyObservable::reset', () => {
    value.set(initialValue)
    return value.get()
  })
  const reload = () => {
    started = false
    return load()
  }

  return {
    load: load,
    reload: reload,
    current: load,
    reset: reset,
    refresh: () => (started ? reload() : value.get())
  }
}

function createObservableBoxValue<T>(point: string, namespace?: string, handler?: IHandler<T>) {
  const value = lazyObservable<T>(async sync => {
    const o0 = await __app__.loadPoint(point, namespace)
    const o1 = await (handler || noop)(o0)
    sync(o1)
  }, [])
  __app__.on(genReloadPointEventName(point, namespace), () => value.refresh())
  return value
}

const noop = (data: any) => data

export default point

export function point<T = any>(point: string, namespace?: string, handler?: IHandler<T>) {
  return (target: object, key: string | symbol) => {
    const value = createObservableBoxValue<T>(point, namespace, handler)
    Object.defineProperty(target, key, {
      enumerable: true,
      get: () => value.load()
    })
  }
}
