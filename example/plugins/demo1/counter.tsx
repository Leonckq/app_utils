import React from 'react'
import { connect } from '@ekuaibao/mobx-store'
import { dispatchDOMEvent, onListenDOMEvent, notifyReloadPoint, useApp, App, app } from '../../../src'

interface Props {
  app: App
  increment: () => any
  decrement: () => any
  count: number
  menus: any[]
  menuLabels: string[]
}

import loadable from '@loadable/component'
import { observable } from 'mobx'

const DY = loadable<any>(app.require('@comps/DY'))
const DZ = app.require<React.ComponentClass<any>>('@comps/DZ')

class Counter extends React.Component<Props> {
  disposer0: Function
  disposer1: Function

  @observable ddd = [1, 2, 3, 4]

  increment = () => {
    this.props.increment()
  }

  decrement = () => {
    this.props.decrement()
  }

  globalIncrement = () => {
    dispatchDOMEvent({ type: 'INCREMENT', detail: { f_0a: false } })
  }

  globalDecrement = () => {
    dispatchDOMEvent('DECREMENT', { fffff: { xxxx: 0 } })
  }

  componentDidMount() {
    this.disposer0 = onListenDOMEvent('INCREMENT', data => {
      console.log('=========>INCREMENT>>', data)
      this.props.increment()
    })

    this.disposer1 = onListenDOMEvent('DECREMENT', data => {
      console.log('=========>DECREMENT>>', data)
      this.props.decrement()
    })
  }

  componentWillUnmount() {
    this.disposer0 && this.disposer0()
    this.disposer1 && this.disposer1()
  }

  toggle = () => {
    const { app } = this.props
    // @ts-ignore
    app.needmenuP2 = !app.needmenuP2
    notifyReloadPoint('@menu')
  }

  render() {
    console.log('=====================render==dddd', this.ddd)
    return (
      <div>
        <br />
        <div>
          <b> Count: {this.props.count}</b>
          <br />
          <button onClick={this.increment}>local increment</button>
          &nbsp;Send a <b>local</b> increment event. This will only increase the counter for the current app. <br />
          <button onClick={this.decrement}>local decrement</button>
          &nbsp;Send a <b>local</b> decrement event. This will only decrement the counter for the current app. <br />
          <button onClick={this.globalIncrement}>global increment</button>
          &nbsp;Send a <b>global</b> increment event. This will increase the counter for the current app and all other apps that
          listen to this event. <br />
          <button onClick={this.globalDecrement}>global decrement</button>
          &nbsp;Send a <b>global</b> decrement event. This will increase the counter for the current app and all other apps that
          listen to this event. <br />
        </div>

        <hr />
        <button onClick={this.toggle}> toggle </button>
        <hr />

        <pre>{JSON.stringify(this.props.menus, null, 2)}</pre>
        <hr />

        <pre>{JSON.stringify(this.props.menuLabels, null, 2)}</pre>
        <hr />

        <img width={200} height={80} src={this.props.app.require('@images', '404.png')} />

        <hr />

        <DY kkk={666} />
        <DZ kkk={777} />
      </div>
    )
  }
}

export default useApp(
  connect(store => ({
    menus: store.states.demo1.menus,
    menuLabels: store.states.demo1.menuLabels,
    count: store.states.demo1.count,
    increment: store.dispatch('demo1/increment'),
    decrement: store.dispatch('demo1/decrement')
  }))(Counter)
)
