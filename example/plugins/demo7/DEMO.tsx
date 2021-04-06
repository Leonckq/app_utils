/**************************************************
 * Created by nanyuantingfeng on 2018/7/11 19:52.
 **************************************************/
import React from 'react'
import { usePoint } from '../../../src'

class DEMO extends React.Component<{ point: any[] }> {
  render() {
    return <div>{JSON.stringify(this.props.point)}</div>
  }
}

export default usePoint('@menu')(DEMO)
