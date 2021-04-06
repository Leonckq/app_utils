/***************************************************
 * Created by nanyuantingfeng on 2020/2/17 14:59. *
 ***************************************************/
import React from 'react'
import { app } from '../../../src'
import SelectOneResource from './SelectOneResource'
import OpenResourceInModal from './OpenResourceInModal'

export default class P8DEMO extends React.Component {
  render() {
    console.log('P8DEMO : render')

    return (
      <div>
        P8
        <SelectOneResource />
        <OpenResourceInModal />
        <button onClick={this.testDEMO0000}>TEST request("demo00000")</button>
      </div>
    )
  }

  testDEMO0000 = async () => {
    const result = await app.request('demo00000', { a: 0 }, { b: 1 })
    console.log('result:demo00000', result)
  }
}
