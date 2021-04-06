/**************************************************
 * Created by nanyuantingfeng on 2018/8/6 15:32.
 **************************************************/
import React from 'react'
import { Subtract } from 'utility-types'
import { Point } from './Point'

interface InjectedPoint<P = any> {
  point: P[]
}

export default usePoint

export function usePoint<T, D>(point: string, namespace?: string, propKey: string = 'point') {
  return <T extends InjectedPoint>(WrappedComponent: React.ComponentType<T>) => {
    type HocProps = Subtract<T, InjectedPoint>
    return class extends React.Component<HocProps> {
      static displayName = `usePoint(${WrappedComponent.displayName || WrappedComponent.name})`
      render() {
        const { props } = this
        return (
          <Point<D> point={point} namespace={namespace}>
            {(data: D[]) => React.createElement(WrappedComponent, { ...(props as any), [propKey]: data })}
          </Point>
        )
      }
    } as any
  }
}
