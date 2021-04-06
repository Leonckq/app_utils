/******************************************************
 * Created by nanyuantingfeng on 2018/7/11 20:21.
 *****************************************************/
import App from '../integrate/App'
import { isFunction } from '@ekuaibao/helpers'
import { container } from './container'
import { ContainerInstance } from 'typedi'
import { ISDK } from '@ekuaibao/sdk-bridge/types'
import { Collection } from '@ekuaibao/mobx-cobweb'

export interface AppInstance extends App {
  container: ContainerInstance
  collection: Collection
  sdk: ISDK
}

export const app = new App() as AppInstance

container.set('@@bus', app)
container.set('@@app', app)

app.container = container
app.collection = new Collection()
container.set('@collection', app.collection)

// API 提供.修正@@layers的prefix 策略
app.hook('onload', data => {
  if (data.prefix && data.point) {
    data.value = data.value.map((line: any) => ({ ...line, key: `${data.prefix}:${line.key}` }))
    delete data.prefix
  }
  return data
})

// API 提供.修正store节点的策略
app.hook('onfirst', async plugin => {
  if (!plugin.store) return plugin

  let key
  let value

  if (isFunction(plugin.store)) {
    key = plugin.id
    value = plugin.store
  } else {
    key = plugin.store.key
    value = plugin.store.value
  }

  delete plugin.store
  await app.store.dynamic(key, value).load(key)

  return plugin
})

export default app
