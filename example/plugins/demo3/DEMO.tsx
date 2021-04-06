/**************************************************
 * Created by nanyuantingfeng on 2018/7/11 19:52.
 **************************************************/
import React from 'react'
import { useApp } from '../../../src/'
import { usePoint, App } from '../../../src'
import { AsyncComponent } from '@ekuaibao/async-component'

class DEMO extends React.Component<{ app: App; point: any[] }> {
  render() {
    const { app, point } = this.props
    const data = app.apply('@p0', 'getInfo', 1, 2, 3)
    return (
      <div>
        P3
        <hr />
        <hr />
        <hr />
        扩展点 xxx ===
        {point.map((X, i) => (
          <X key={i} />
        ))}
        <hr />
        <hr />
        <hr />
        <hr />
        @p0:getInfo === {data}
        <hr />
        <AsyncComponent onload={app.applyService('@p0', 'getName', 2, 3, 500)} />
        <hr />
        <AsyncComponent onload={() => app.applyService('@p0', 'getName', 2, 3, 600)} />
        <hr />
        <AsyncComponent onload={async () => app.applyService('@p0', 'getName', 2, 3, 700)} />
      </div>
    )
  }
}

export default useApp(usePoint('@xxx')(DEMO))
