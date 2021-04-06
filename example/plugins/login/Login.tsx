/**************************************************
 * Created by nanyuantingfeng on 2018/7/12 12:44.
 **************************************************/
import React from 'react'
import { useApp } from '../../../src'

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb: Function) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb: Function) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

@useApp
class Login extends React.Component<any> {
  login = () => {
    fakeAuth.authenticate(() => {
      this.props.app.go('/')
    })
  }

  render() {
    return (
      <div>
        <p>You must log in to view the page at </p>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}

export default Login
