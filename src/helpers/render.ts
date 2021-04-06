/******************************************************
 * Created by nanyuantingfeng on 2018/7/11 18:25.
 *****************************************************/
import React from 'react'
import ReactDOM from 'react-dom'
import { uuid } from '@ekuaibao/helpers'

function createContainer(elementId: string = uuid(8)): Element {
  let element = document.getElementById(elementId)

  if (element) {
    return element
  }

  element = document.createElement('div')
  element.id = elementId
  document.body.appendChild(element)
  return element
}

export default renderAsApp

export async function renderAsApp(ClazzOrElement: React.ReactElement | React.ComponentClass, props?: any) {
  return renderToBody(ClazzOrElement, props, 'app')
}

export async function renderToBody(ClazzOrElement: React.ReactElement | React.ComponentClass, props?: any, elementId?: string) {
  if (React.isValidElement(ClazzOrElement)) {
    return ReactDOM.render(ClazzOrElement, createContainer(elementId))
  }

  return new Promise(resolve =>
    ReactDOM.render(React.createElement(ClazzOrElement as React.ComponentClass, props), createContainer(elementId), resolve)
  )
}
