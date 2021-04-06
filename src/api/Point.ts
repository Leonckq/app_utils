/******************************************************
 * Created by nanyuantingfeng on 2018/9/7 11:44.
 *****************************************************/
import React from 'react'
import app from './app'

interface IPointProps<T = any> {
  point: string
  namespace?: string
  children: (data: T[]) => React.ReactElement
}

interface IPointState<T = any> {
  point?: string
  namespace?: string
  pointData?: T[]
  isNeedUpdate: boolean
}

import { genReloadPointEventName } from './notifyReloadPoint'

export class Point<T = any> extends React.Component<IPointProps<T>, IPointState<T>> {
  state: IPointState<T> = { isNeedUpdate: false, pointData: null }

  private __ISMOUNTED = false

  loadPoint = async () => {
    const { point, namespace } = this.state
    const pointData = await app.loadPoint<T>(point, namespace)

    if (this.__ISMOUNTED) {
      this.setState({ pointData, isNeedUpdate: false })
    }
  }

  static getDerivedStateFromProps<T>(nextProps: IPointProps<T>, prevState: IPointState<T>) {
    if (nextProps.point !== prevState.point || nextProps.namespace !== prevState.namespace) {
      return {
        point: nextProps.point,
        namespace: nextProps.namespace,
        isNeedUpdate: true
      }
    }
    return null
  }

  componentDidUpdate(prevProps: IPointProps<T>, prevState: IPointState<T>) {
    if (this.state.isNeedUpdate === true) {
      this.__un(prevState)
      this.__on(this.state)
      this.loadPoint()
    }
  }

  componentDidMount() {
    this.__ISMOUNTED = true
    this.__on(this.state)
    this.loadPoint()
  }

  private __on(state: IPointState<T>) {
    const { point, namespace } = state
    app.on(genReloadPointEventName(point, namespace), this.loadPoint)
  }

  private __un(state: IPointState<T>) {
    const { point, namespace } = state
    app.un(genReloadPointEventName(point, namespace), this.loadPoint)
  }

  componentWillUnmount() {
    this.__ISMOUNTED = false
    this.__un(this.state)
  }

  render() {
    const { children } = this.props
    const { pointData } = this.state
    return pointData ? children(pointData) : null
  }
}

export default Point
