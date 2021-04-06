/******************************************************
 * Created by nanyuantingfeng on 2018/7/20 17:09.
 *****************************************************/
// @ts-ignore
const NativeCustomEvent = window['CustomEvent']

interface IParams {
  bubbles?: boolean
  cancelable?: boolean
  detail?: any
}

const defaultProps: IParams = {
  bubbles: false,
  cancelable: false,
  detail: undefined
}

function isUseNative(): boolean {
  try {
    const p = new NativeCustomEvent('demo', { detail: { foo: 'xxx' } })
    return 'demo' === p.type && 'xxx' === p.detail.foo
  } catch (e) {}
  return false
}

function isUseModern(): boolean {
  return document && 'function' === typeof document.createEvent
}

function initModernEvent(type: string, params?: IParams): CustomEvent {
  const e = document.createEvent('CustomEvent')
  const { bubbles, cancelable, detail } = { ...defaultProps, ...params }
  e.initCustomEvent(type, bubbles, cancelable, detail)
  return e
}

function initLegacyEvent(type: string, params?: IParams): CustomEvent {
  // @ts-ignore
  const e = document['createEventObject']()
  const { bubbles, cancelable, detail } = { ...defaultProps, ...params }

  e.type = type
  e.bubbles = bubbles
  e.cancelable = cancelable
  e.detail = detail
  return e
}

export default initEvent

export function initEvent(type: string, params?: IParams) {
  if (isUseNative()) {
    return new NativeCustomEvent(type, params)
  }

  if (isUseModern) {
    return initModernEvent(type, params)
  }

  return initLegacyEvent(type, params)
}
