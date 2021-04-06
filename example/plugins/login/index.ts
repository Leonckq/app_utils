/**************************************************
 * Created by nanyuantingfeng on 2018/7/12 12:43.
 **************************************************/

export default {
  id: '@login',
  path: '/login',
  strict: true,
  exact: true,
  onload: (app: any) => {
    console.log('---------------------------->>>>onload:@login')
    // @ts-ignore
    return import('./Login')
  }
}
