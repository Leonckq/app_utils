/***************************************************
 * Created by nanyuantingfeng on 2020/9/7 12:16. *
 ***************************************************/
import React from 'react'
import { EnhanceConnect } from '@ekuaibao/store'
import { app } from '../../../src/api'

const K = (state: any) => {
  return {
    demo0: state['@p000'].demo0,
    demo1: state['@p000'].demo1,
    demo2: state['@p000'].demo2,
    demo3: state['@p000'].demo3
  }
}

@EnhanceConnect(K)
export default class View0 extends React.Component<any> {
  componentDidMount() {
    app.dispatch({
      type: '@p000/T0',
      payload: new Promise((resolve, reject) => {
        setTimeout(
          () =>
            resolve({
              aaa: Math.random()
            }),
          100
        )
      })
    })

    app.dispatch({
      type: '@p000/T1',
      payload: new Promise((resolve, reject) => {
        setTimeout(
          () =>
            resolve({
              aaa: Math.random()
            }),
          300
        )
      })
    })

    app.dispatch({
      type: '@p000/T2',
      payload: new Promise((resolve, reject) => {
        setTimeout(
          () =>
            resolve({
              aaa: Math.random()
            }),
          700
        )
      })
    })

    app.dispatch({
      type: '@p000/T3',
      payload: new Promise((resolve, reject) => {
        setTimeout(
          () =>
            resolve({
              aaa: Math.random()
            }),
          1000
        )
      })
    })

    app.dispatch({
      type: '@p111/T3',
      payload: new Promise((resolve, reject) => {
        setTimeout(
          () =>
            resolve({
              aaa: Math.random()
            }),
          1000
        )
      })
    })

    app.dispatch({
      type: '@p111/T2',
      payload: new Promise((resolve, reject) => {
        setTimeout(
          () =>
            resolve({
              aaa: Math.random()
            }),
          2000
        )
      })
    })
  }

  render() {
    console.log('render------View0')
    return (
      <pre>
        {JSON.stringify(
          {
            demo0: this.props.demo0,
            demo1: this.props.demo1,
            demo2: this.props.demo2,
            demo3: this.props.demo3
          },
          null,
          4
        )}
      </pre>
    )
  }
}
