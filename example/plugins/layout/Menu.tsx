/**************************************************
 * Created by nanyuantingfeng on 2018/7/12 11:28.
 **************************************************/
import React, { Component } from 'react'
import { Link } from '@ekuaibao/navigator'
import { useApp, usePoint } from '../../../src'

class Menu extends Component<{ point: any[] }> {
  render() {
    const { point } = this.props

    return (
      <div className="navbar">
        <ul style={{ flex: 1 }}>
          {point.map((d, i) => {
            const { label, href } = d
            return (
              <Link href={href} key={href + i}>
                <li>{label}</li>
              </Link>
            )
          })}
        </ul>

        <ul style={{ textAlign: 'right' }}>
          <Link href="/login" key="/login">
            <li>logout</li>
          </Link>
        </ul>
      </div>
    )
  }
}

export default useApp(usePoint('@menu')(Menu))
