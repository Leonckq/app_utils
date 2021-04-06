/******************************************************
 * Created by nanyuantingfeng on 2019-02-21 17:47.
 *****************************************************/
import React from 'react'
import { Store } from '@ekuaibao/mobx-store'
import { ComposeFn } from '@ekuaibao/helpers'
import { History, Location } from 'history'

export namespace Whispered {
  export type Services = {
    [others: string]: (...args: any[]) => any
  }
  export type ServicesFn = (app?: App) => Promise<Services>
  export type OnLoadFn<T> = (app?: App) => T | Promise<T>
  export type IOnLoadCachedFn<T> = {
    cache: number
    value: OnLoadFn<T>
  }

  export type Plugin<T = any> = Partial<{
    id: string
    onload: OnLoadFn<T> | IOnLoadCachedFn<T>
    onbefore: ComposeFn<ThisType<App>>
    onfirst: (app?: App) => void
    onready: (app?: App) => void
    onafter: (app?: App) => void
    reducer: () => Promise<any>
    store: { key: string; value: () => Promise<any> } | (() => Promise<any>)
    resource: string
    dependencies: string | string[]
    value: T
    services: Services | ServicesFn
    path: string
    ref: string
    point: string
    namespace: string
    [others: string]: any
  }>

  export interface Context {
    readonly plugins: Plugin[]
    getPluginById<T>(id: string): Plugin<T>
    getPluginsByIds<T>(ids: string[]): Array<Plugin<T>>
    hook<T>(name: string, handler: (data: any) => T): this
    use<T>(plugin: Plugin<T> | Array<Plugin<T>> | Promise<Plugin<T> | Array<Plugin<T>>>): this
    loadPoint<T>(point: string, namespace?: string): Promise<T[]>
    reloadPoint<T>(point: string, namespace?: string): Promise<T[]>
    callback(fn: (ctx?: any) => any): Promise<any>
    applyService<T>(id: string, serviceName: string, ...args: any[]): Promise<T>
    apply<T>(id: string, fnName: string, ...args: any[]): T
    require<T>(namespace: string, key?: string): T
  }

  export interface App extends Context {
    readonly history: History<any>
    useHistoryType(type?: string, options?: object): this
    getCurrentPluginId(location?: Location): string
    start(): Promise<void>
    go(href: string | number, replace?: boolean): void
    redirect(toPath: string): void
    wrapAsLazyComponent<T>(onload: Promise<{ default: T }> | (() => Promise<{ default: T }>)): React.ComponentType

    readonly store: Store
    callback(fn: (children: React.ReactElement) => React.ReactElement): Promise<React.ReactElement>
    on(name: string, fn: (...args: any[]) => void): this
    un(name: string, fn: (...args: any[]) => void): this
    once(name: string, fn: (...args: any[]) => void): this
    emit(name: string, ...args: any[]): this
    watch<T>(name: string, fn: (...args: any[]) => T): this
    invoke<T>(name: string, ...args: any[]): Promise<T>
  }
}
