/**************************************************
 * Created by nanyuantingfeng on 2018/8/30 13:13.
 **************************************************/
import { observable, computed } from 'mobx'
import { action } from '@ekuaibao/mobx-store'
import { point } from '../../../src'

export default class DEMO1 {
  @observable
  count = 28

  @action()
  increment() {
    this.count += 1
  }

  @action()
  decrement() {
    this.count -= 1
  }

  @point('@menu', null, (data: any[]) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const oo: any = {}
        data.forEach(line => (oo[line.label] = line))
        resolve(oo)
      }, 200)
    })
  })
  menus: any[]

  @computed
  get menuLabels() {
    return Object.keys(this.menus).filter((d, i) => i % 2)
  }
}
