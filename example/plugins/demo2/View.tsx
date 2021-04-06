/**************************************************
 * Created by nanyuantingfeng on 2018/7/5 11:13.
 **************************************************/
import React from 'react'
import { inject } from '@ekuaibao/mmlpx'
import { observer } from 'mobx-react'
import VStore from './VStore'

@observer
export default class BBB extends React.Component {
  @inject(VStore)
  vStore: any = null

  render() {
    return (
      <div>
        BBBB
        <hr />
        <pre>{JSON.stringify(this.vStore.todostore, null, 2)}</pre>
      </div>
    )
  }
}
