/******************************************************
 * Created by nanyuantingfeng on 2018/9/7 12:33.
 *****************************************************/
import app from './app'

export function genReloadPointEventName(point: string, namespace?: string) {
  return namespace ? `@@refresh::${point}::${namespace}` : `@@refresh::${point}`
}

export async function notifyReloadPoint<T = any>(point: string, namespace?: string): Promise<T[]> {
  const data = await app.reloadPoint<T>(point, namespace) // 刷新缓存
  app.emit(genReloadPointEventName(point, namespace))
  return data
}

export default notifyReloadPoint
