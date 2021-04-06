/**************************************************
 * Created by nanyuantingfeng on 2018/9/27 14:05.
 **************************************************/
import React from 'react'
import ReactDOM from 'react-dom'

export default class MOC extends React.Component {
  state: any = {
    notices: []
  }

  add = (notice: any) => {}

  remove = (key: any) => {}

  render() {
    return <div id={'x---moc'} />
  }

  static newInstance(properties: any, callback: (obj: any) => void) {
    const { getContainer = null, ...props } = properties || {}
    const div = document.createElement('div')
    let dom = document.body

    if (getContainer) {
      dom = getContainer()
    }

    dom.appendChild(div)

    let called = false

    function ref(notification: MOC) {
      if (called) {
        return
      }
      called = true

      callback({
        notice(noticeProps: any) {
          notification.add(noticeProps)
        },
        removeNotice(key: string) {
          notification.remove(key)
        },
        component: notification,

        destroy() {
          ReactDOM.unmountComponentAtNode(div)
          div.parentNode.removeChild(div)
        }
      })
    }

    ReactDOM.render(<MOC {...props} ref={ref} />, div)
  }
}
