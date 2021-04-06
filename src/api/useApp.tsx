/******************************************************
 * Created by nanyuantingfeng on 2018/7/11 20:27.
 *****************************************************/
import React from 'react'
import { Subtract } from 'utility-types'
import App from '../integrate/App'
import app from './app'

export type IPropsWithApp<T = any> = T & { app: App; [key: string]: any }

export const useApp = <T extends IPropsWithApp>(WrappedComponent: React.ComponentType<T>) => {
  type HocProps = Subtract<T, IPropsWithApp>
  return class extends React.Component<HocProps> {
    static displayName = `useApp(${WrappedComponent.displayName || WrappedComponent.name})`
    render() {
      const { props } = this
      return <WrappedComponent {...props as any} app={app} />
    }
  } as any
}

export default useApp
