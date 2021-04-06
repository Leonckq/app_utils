/**************************************************
 * Created by nanyuantingfeng on 19/12/2016 18:21.
 **************************************************/
import React from 'react'
import { Point } from './Point'
import { AsyncComponent } from '@ekuaibao/async-component'
const flatten = (arr: any[]) => arr.reduce((a, b) => a.concat(b), [])

export interface UIContainerProps {
  name: string
  [key: string]: any
}

export const UIContainer: React.FunctionComponent<UIContainerProps> = props => {
  const { name, ...others } = props
  const [namespace, ...nx] = name.split(':')
  const key = nx.join(':')
  return (
    <Point point="@@components" namespace={namespace}>
      {data => {
        if (!data) {
          console.warn(`@@components 没有找到注册的值`)
          return null
        }

        const line = flatten(data).find((line: any) => line.key === key)

        if (!line) {
          throw new Error(`Container:name(${name}) 没有找到`)
        }

        return <AsyncComponent onload={line.component} extraProps={others} />
      }}
    </Point>
  )
}

UIContainer.displayName = 'Container'

export default UIContainer
