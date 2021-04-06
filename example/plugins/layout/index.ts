/**************************************************
 * Created by nanyuantingfeng on 2018/7/5 11:13.
 **************************************************/

export default [
  {
    id: '@p0',
    path: '/',
    // @ts-ignore
    onload: () => import('./Layout'),

    getInfo(a: any, b: any, c: any) {
      return `INfos` + [a, b, c]
    },

    // @ts-ignore
    services: () => import('./services')
  }
]
