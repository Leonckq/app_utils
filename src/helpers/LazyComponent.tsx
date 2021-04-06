/***************************************************
 * Created by nanyuantingfeng on 2020/9/8 18:29. *
 ***************************************************/
import React from 'react'
import { isFunction } from '@ekuaibao/helpers'
import { LazyComponent as ACL } from '@ekuaibao/async-component'

type U = { default: React.ComponentType }
type N = Promise<U> | (() => Promise<U>)

export class LazyComponent<P extends { onload: N }> extends React.Component<P> {
  render() {
    const { onload, ...others } = this.props

    let lazyFn = onload as () => Promise<U>

    if (!isFunction(onload)) {
      // must be Promise.resolve ...
      lazyFn = () => Promise.resolve(onload as Promise<U>)
    }

    return <ACL onload={lazyFn} {...others} />
  }
}

export default LazyComponent
