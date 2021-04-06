/***************************************************
 * Created by nanyuantingfeng on 2020/9/7 12:07. *
 ***************************************************/

import { Reducer } from '@ekuaibao/store'

const reducer = new Reducer('@p000', {
  demo0: {}
})

reducer

  .handle(`@p000/T0`, (state: any, action: any) => {
    return { ...state, demo0: action.payload }
  })

  .handle(`@p000/T1`, (state: any, action: any) => {
    return { ...state, demo1: action.payload }
  })

  .handle(`@p000/T2`, (state: any, action: any) => {
    return { ...state, demo2: action.payload }
  })

  .handle(`@p000/T3`, (state: any, action: any) => {
    return { ...state, demo3: action.payload }
  })

export default reducer
