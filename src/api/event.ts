/******************************************************
 * Created by nanyuantingfeng on 2018/8/11 01:15.
 *****************************************************/
import initEvent from './initEvent'

export interface IEventData {
  type: string
  detail: any
}

function dispatch<T>(type: string, detail: T) {
  window.dispatchEvent(initEvent(type, { bubbles: false, cancelable: false, detail: detail }))
}

export function dispatchDOMEvent<T>(type: IEventData | string, detail?: T) {
  if (typeof type === 'string') {
    return dispatch(type as string, detail)
  }

  const { type: name, detail: data } = type as IEventData
  return dispatch<T>(name, data)
}

export function onListenDOMEvent<T>(type: string, handler: (detail: T) => void): () => void {
  const fn = (event: CustomEvent<T>) => handler(event.detail)
  window.addEventListener(type, fn, false)
  return () => window.removeEventListener(type, fn, false)
}
