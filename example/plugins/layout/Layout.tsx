/**************************************************
 * Created by nanyuantingfeng on 2018/7/5 11:13.
 **************************************************/
import React from 'react'
import Menu from './Menu'

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <Menu />
        <div>{this.props.children}</div>
      </div>
    )
  }
}
