/**************************************************
 * Created by nanyuantingfeng on 2018/7/11 19:52.
 **************************************************/
import React, { Component } from 'react'
import { Point } from '../../../src'

class DD extends React.PureComponent<any> {
  render() {
    const { props } = this
    console.log('===========Point=CC=======', props.data)
    return JSON.stringify(props.data)
  }
}

export default class DEMO extends Component<any> {
  state = { point: '@menu' }

  render() {
    return (
      <div>
        <Point point={this.state.point}>{data => <DD data={data} />}</Point>
        <hr />
        <button onClick={this.h0}>change -0 </button>
        <button onClick={this.h1}>change -1 </button>
      </div>
    )
  }

  h0 = () => {
    this.setState({ point: '@demo' })
  }
  h1 = () => {
    this.setState({ point: '@menu' })
  }
}
