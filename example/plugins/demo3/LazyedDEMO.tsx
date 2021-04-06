/**************************************************
 * Created by nanyuantingfeng on 2018/7/18 15:39.
 **************************************************/
import React from 'react'
import { App, useApp, notifyReloadPoint } from '../../../src'
import { usePoint } from '../../../src'

interface Props {
  app: App
  point: any[]
}

interface State {
  needmenuP2: boolean
}

export class LazyedDEMO extends React.Component<Props, State> {
  constructor(props: Props, ...args: any[]) {
    super(props, ...args)
    this.state = {
      // @ts-ignore
      needmenuP2: !!props.app.needmenuP2
    }
  }

  toggle = () => {
    const { app } = this.props
    const { needmenuP2 } = this.state
    // @ts-ignore
    app.needmenuP2 = !needmenuP2
    this.setState({ needmenuP2: !needmenuP2 })
    notifyReloadPoint('@menu')
  }

  render() {
    return (
      <div>
        {JSON.stringify(this.props.point)}
        <br />
        <hr />
        <button onClick={this.toggle}>{!this.state.needmenuP2 ? '加上' : '去掉'}</button>
        <hr />
      </div>
    )
  }
}

const WrappedLazyedDEMO = useApp(usePoint('@menu')(LazyedDEMO))

export default WrappedLazyedDEMO
