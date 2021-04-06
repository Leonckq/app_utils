/**************************************************
 * Created by nanyuantingfeng on 2018/7/10 17:06.
 **************************************************/
import { Whispered } from '../types'
import Registry from './Registry'
import { compose, getModuleDefault, isFunction, isNone, isPromise, uuid } from '@ekuaibao/helpers'
import PointCellar from './PointCellar'
import throttleCache from '../helpers/throttleCache'
import Hooks from './Hooks'
import MessageCenter from '@ekuaibao/messagecenter'
import { lazy } from '../helpers'

export default class Context extends MessageCenter implements Whispered.Context {
  private readonly _registry: Registry = new Registry()
  private readonly _asyncplugins: Array<Promise<Whispered.Plugin | Whispered.Plugin[]>> = []
  private readonly _didonfirstmap = new Set<string>()
  private readonly _pointcache = new PointCellar<any>()
  private readonly _servicescache = new Map<string, Whispered.Services>()
  private readonly _hooks = new Hooks()

  readonly plugins: Whispered.Plugin[] = []

  getPluginById<T>(id: string): Whispered.Plugin<T> {
    const p = this.plugins.find(p => p.id === id)
    if (!p) {
      throw new Error(`do not exist plugin<${id}>`)
    }
    return p
  }

  getPluginsByIds<T>(ids: string[]): Array<Whispered.Plugin<T>> {
    return ids.map(id => this.getPluginById(id))
  }

  hook<T>(name: string, handler: (data: any) => T): this {
    this._hooks.reg<T>(name, handler)
    return this
  }

  protected getPluginsWithDepts<T>(id: string): Array<Whispered.Plugin<T>> {
    const ids = this._registry.getOne(id)
    return this.getPluginsByIds(ids)
  }

  protected getPluginsWithWeakDepts<T>(id: string): Array<Whispered.Plugin<T>> {
    const ids = this._registry.getWeakOne(id)
    return this.getPluginsByIds(ids)
  }

  protected async loadOne<T>(id: string): Promise<Whispered.Plugin<T>> {
    await this.runOnBefores(id)
    return this.loadPlugin(this.getPluginById<T>(id))
  }

  protected async loadWithDepts<T>(id: string): Promise<Array<Whispered.Plugin<T>>> {
    const plugins = this.getPluginsWithDepts<T>(id)
    return Promise.all(plugins.map(line => this.loadPlugin(line)))
  }

  protected async loadWithWeakDepts<T>(id: string): Promise<Array<Whispered.Plugin<T>>> {
    const plugins = this.getPluginsWithWeakDepts<T>(id)
    return Promise.all(plugins.map(line => this.loadPlugin(line)))
  }

  protected async loadWithWeakDeptsWithoutSelf<T>(id: string): Promise<Array<Whispered.Plugin<T>>> {
    const ids = this._registry.getWeakOneWithoutSelf(id)
    const plugins = this.getPluginsByIds<T>(ids)
    return Promise.all(plugins.map(line => this.loadPlugin(line)))
  }

  protected async loadPlugin<T>(plugin: Whispered.Plugin<T>): Promise<Whispered.Plugin<T>> {
    const { id, onload } = plugin

    if (!this._didonfirstmap.has(id)) {
      const onfirstHooks = this._hooks.onfirst.compose()

      const plugins = this.getPluginsWithDepts(id).filter(plugin => !this._didonfirstmap.has(plugin.id))

      // 调整位置先行锁定 onfirst
      // 如果调用时候不使用await关键字
      // !this._didonfirstmap.has(id) 判断机制将会出现漏洞
      // 导致 onfirst 出现多次调用.
      // 由第 86 行调整至此, 可以修复此问题
      // 可以查看测试用例的 `multi loadOne and do not by await`
      plugins.forEach(p => this._didonfirstmap.add(p.id))

      await Promise.all(plugins.map(plugin => onfirstHooks(plugin)))
      await Promise.all(plugins.map(plugin => plugin.onfirst && plugin.onfirst(this as any)))

      // plugins.forEach(p => this._didonfirstmap.add(p.id))
    }

    if (!onload) {
      return plugin
    }

    // Use Promise Cache For Throttle onload .
    const memoized = throttleCache(id, (onload as Whispered.IOnLoadCachedFn<T>).cache, async () => {
      let fn: Whispered.OnLoadFn<T> = onload as Whispered.OnLoadFn<T>
      if ((onload as Whispered.IOnLoadCachedFn<T>).value) {
        fn = (onload as Whispered.IOnLoadCachedFn<T>).value
      }
      const result = await fn(this as any)
      return getModuleDefault<T>(result)
    })

    const value = await memoized()
    const onloadhooks = this._hooks.onload.compose<typeof value>()
    return onloadhooks({ ...plugin, value })
  }

  private async loadServices(id: string): Promise<Whispered.Services> {
    if (this._servicescache.has(id)) {
      return this._servicescache.get(id)
    }

    const plugin = this.getPluginById(id)
    let services = plugin.services as Whispered.Services

    if (isFunction(plugin.services)) {
      const mm = await (plugin.services as Whispered.ServicesFn)(this as any)
      services = getModuleDefault(mm)
    }

    this._servicescache.set(id, services)
    return services
  }

  protected async runOnBefores<T>(id: string) {
    const plugins = await this.getPluginsWithDepts<T>(id)
    const onbefores = plugins.filter(p => isFunction(p.onbefore)).map(plugin => plugin.onbefore)
    await compose(onbefores)(this)
  }

  use<T>(
    plugin: Whispered.Plugin<T> | Array<Whispered.Plugin<T>> | Promise<Whispered.Plugin<T> | Array<Whispered.Plugin<T>>>
  ): this {
    if (isPromise(plugin)) {
      this._asyncplugins.push(plugin as Promise<Whispered.Plugin<T> | Array<Whispered.Plugin<T>>>)
      return this
    }

    if (!Array.isArray(plugin)) {
      plugin = [plugin as Whispered.Plugin<T>]
    }

    const plugins = (plugin as Array<Whispered.Plugin<T>>).map(p => {
      if (!p.id) {
        p.id = uuid(8, 16)
      }

      if (p.id === p.point) {
        throw new Error(` 'id' & 'point' must be different  >> ${p.id}`)
      }

      return p
    })

    this.plugins.push(...plugins)
    return this
  }

  async loadPoint<T>(point: string, namespace?: string): Promise<T[]> {
    if (!this._pointcache.has(point, namespace)) {
      await this.reloadPoint<T>(point, namespace)
    }
    return this._pointcache.get(point, namespace)
  }

  async reloadPoint<T>(point: string, namespace?: string): Promise<T[]> {
    if (!namespace) {
      const points = await this.loadWithWeakDeptsWithoutSelf(point)
      const data = points.map(p => p.value).filter(v => !isNone(v)) as T[]
      this._pointcache.setList(point, data)
      return data
    }

    const plugins = this.plugins.filter(plugin => plugin.point === point && plugin.namespace === namespace)
    const points = await Promise.all(plugins.map(line => this.loadPlugin(line)))
    const data = points.map(p => p.value).filter(v => !isNone(v)) as T[]
    this._pointcache.setNSList(point, namespace, data)
    return data
  }

  async callback(fn: (ctx?: any) => any): Promise<any> {
    const plugins = await Promise.all(this._asyncplugins)
    plugins.forEach(p => this.use(getModuleDefault(p as any)))

    const onusehooks = this._hooks.onuse.compose<Whispered.Plugin>()

    this.plugins
      .map(p => onusehooks(p))
      .forEach(p => {
        const { id, point, dependencies } = p
        this._registry.addDepts(id, dependencies)
        point && this._registry.addWeakDepts(point, id)
      })

    await Promise.all(this.plugins.filter(p => isFunction(p.onready)).map(p => p.onready(this as any)))
    const onreadStartHooks = this._hooks.onready.compose()
    await onreadStartHooks(this)
    await fn(this)

    await Promise.all(this.plugins.filter(p => isFunction(p.onafter)).map(p => p.onafter(this as any)))
    const onafterEndHooks = this._hooks.onafter.compose()
    await onafterEndHooks(this)
  }

  async applyService<T>(id: string, serviceName: string, ...args: any[]): Promise<T> {
    const services = await this.loadServices(id)
    const fn = services[serviceName] as Function

    if (!fn) {
      throw new Error(`plugin<${id}>services:<${serviceName}> not found`)
    }

    if (!isFunction(fn)) {
      throw new Error(`plugin<${id}>services:<${serviceName}> is not a function`)
    }

    return fn(...args) as T
  }

  invokeService(serviceId: string, ...args: any[]) {
    const ids = serviceId.split(':')
    const id = ids.shift()
    return this.apply<any>(id, ids.join(':'), ...args)
  }

  /**
   * 未最顶层调用 invokeService 需求设计,
   * 可以返回一个 lazy Value, 并且在真是调
   * 用时候去获取值, 并且值永久缓存.
   */
  invokeServiceAsLazyValue(serviceId: string, ...args: any[]) {
    return lazy(() => this.invokeService(serviceId, ...args))
  }

  apply<T>(id: string, fnName: string, ...args: any[]): T {
    const plugin = this.getPluginById(id)

    if (!plugin) {
      throw new Error(`plugin<${id}> not found`)
    }

    const fn = plugin[fnName] as Function

    if (!fn) {
      throw new Error(`plugin<${id}>:<${fnName}> not found`)
    }

    if (!isFunction(fn)) {
      throw new Error(`plugin<${id}>:<${fnName}> is not a function`)
    }

    return fn(...args) as T
  }

  /**
   * @param namespace
   * @param key
   *
   * namespace is resource groupId, like : @images,@components,.....
   * key is `key` of `namespace`.`value`[`key`]
   *
   * if not `key` namespace will be `namespace` + `key`
   * like : app.require("@images/xxx/yyy/ddd")
   *        namespace : `@images`
   *        key : 'xxx/yyy/ddd'
   *        just equals app.require('@images', 'xxx/yyy/ddd')
   */
  require<T>(namespace: string, key?: string): T {
    if (namespace && !key) {
      const nsc = namespace.split('/')
      namespace = nsc.shift()
      key = nsc.join('/')
    }

    const list = this.plugins.filter(p => p.resource === namespace)
    if (!list || !list.length) {
      throw new Error(`没有找到注册的resources<${namespace}>`)
    }

    let oo = undefined
    let i = list.length

    while (--i > -1) {
      const v = list[i]
      if (typeof v.value[key] !== 'undefined') {
        oo = v.value[key]
        break
      }
    }

    if (typeof oo === 'undefined') {
      throw new Error(`没有找到注册的resources<${namespace} : ${key}>`)
    }

    return oo as T
  }
}
