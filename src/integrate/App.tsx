/******************************************************
 * Created by nanyuantingfeng on 2018/8/31 15:20.
 *****************************************************/
import React from 'react'
import {
  createHistory,
  defaultControlHandle,
  MemoryHistoryBuildOptions,
  getBrowserBackControl,
  Router
} from '@ekuaibao/navigator'
import { isNone, getModuleDefault } from '@ekuaibao/helpers'
import { Store } from '@ekuaibao/mobx-store'
import { Provider } from 'mobx-react'
import Context from '../core/Context'
import { LegacyAPI, createLegacyAPI, createReduxStore, StoreProvider, Store as ReduxStore } from '@ekuaibao/store'
import { Whispered } from '../types'
import { IThirdResourceRequestType } from './types'
import ThirdResourcesManager from './ThirdResourcesManager'
import LazyComponent from '../helpers/LazyComponent'

declare const __WHISPERED_PLUGINS__: {
  [key: string]: Whispered.Plugin | Array<Whispered.Plugin> | Promise<Whispered.Plugin | Array<Whispered.Plugin>>
}

export default class App extends Context {
  readonly store: Store = new Store()
  private unlistenBackEvent = () => {}
  private _configs = new Map<string, any>()

  history = createHistory()

  readonly backControl = getBrowserBackControl()

  useHistory(options?: MemoryHistoryBuildOptions) {
    this.history = createHistory(options)
    return this
  }

  useConfig(key: string, value: any) {
    this._configs.set(key, value)
    return this
  }

  getConfig(key: string) {
    return this._configs.get(key)
  }

  private async lazyload<T extends React.ComponentType>(id: string): Promise<{ default: T }> {
    const plugin = await this.loadOne(id)
    const value = plugin.value as T
    return { default: value }
  }

  async callback(fn: (children?: React.ReactElement) => React.ReactElement = n => n): Promise<React.ReactElement> {
    // 注册页面的 回退按钮的监听.
    this.unlistenBackEvent = defaultControlHandle(this.history, () => this.go(-1))

    // @ts-ignore
    const __WHISPERED_PLUGINS__ = window.__WHISPERED_PLUGINS__ || {}
    Object.keys(__WHISPERED_PLUGINS__ || {}).forEach(name => this.use(__WHISPERED_PLUGINS__[name]))

    return new Promise(resolve => {
      super.callback(async () => {
        const routes = this.plugins
          .filter(plugin => !isNone(plugin.path))
          .map(plugin => ({ ...plugin, component: () => this.lazyload(plugin.id) }))

        if (!this.reduxStore) {
          // if store is not initialize before at call app.callback()
          const nn = this.plugins.filter(p => !!p.reducer).map(p => ({ id: p.id, reducer: p.reducer }))
          const reducers = await Promise.all(nn.map(line => line.reducer()))
          nn.forEach((line, i) => (line.reducer = getModuleDefault(reducers[i])))
          this.createStore(nn)
        }

        resolve(
          <Provider store={this.store}>
            <StoreProvider store={this.reduxStore}>
              {fn(<Router history={this.history} routes={routes} fallback={this.getConfig('router.fallback')} />)}
            </StoreProvider>
          </Provider>
        )
      })
    })
  }

  go(href: string | number, replace?: boolean) {
    if (typeof href === 'number') {
      if (href <= 0 && !this.history.canGo(href)) {
        return this.emit('@@:history:cannot:goback')
      }
      return this.history.go(href)
    }

    if (!!replace) {
      return this.history.replace(href)
    }

    this.history.push(href)
  }

  redirect(toPath: string) {
    this.go(toPath, true)
  }

  wrapAsLazyComponent<T>(onload: Promise<{ default: T }> | (() => Promise<{ default: T }>)) {
    return (props: any) => <LazyComponent onload={onload} {...props} />
  }

  __legacy_api_: LegacyAPI

  reduxStore: ReduxStore<any>

  createStore(reduces: any) {
    this.reduxStore = createReduxStore(reduces)
    this.__legacy_api_ = createLegacyAPI(this.reduxStore)
  }

  dispatchO(action: any) {
    return this.__legacy_api_.dispatch(action)
  }

  dispatch(action: any, bool: boolean = false) {
    let promise = null
debugger
    // 更新Cache缓存，获取缓存节点
    const node = this.__legacy_api_.updateCache(action)

    if (bool) {
      promise = this.__legacy_api_.dispatch(action)
    } else {
      const fn = action.done
      promise = new Promise((resolve, reject) => {
        action.done = (state: any, action: any) => {
          fn && fn(state, action)
          action.error ? reject(action.payload) : resolve(action.payload)
        }

        setTimeout(() => this.__legacy_api_.dispatch(action), 4)
      })
    }

    if (node) {
      node.pendding = promise
    }

    return promise
  }

  dataLoader(nodePath = '') {
    return this.__legacy_api_.dataLoader(nodePath)
  }

  updateCache(action: any) {
    return this.__legacy_api_.updateCache(action)
  }

  getState(pluginName?: string) {
    return this.__legacy_api_.getState(pluginName)
  }

  getStore() {
    return this.__legacy_api_.getStore()
  }

  open<T>(key: string, props?: any, ...params: any[]): Promise<T> {
    return this.invoke('@@:open:layer', key, props, ...params)
  }

  close(...params: any[]) {
    return this.invoke('@@:close:layer', ...params)
  }

  thirdResources = new ThirdResourcesManager(this)

  request<T>(type: IThirdResourceRequestType | string, ...data: any[]) {
    return this.thirdResources.request<T>(type, ...data)
  }
}
