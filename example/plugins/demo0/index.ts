/***************************************************
 * Created by nanyuantingfeng on 2020/9/7 12:06. *
 ***************************************************/

export default [
  {
    id: '@p000',
    reducer: () => require('./reducer').default,
    path: '/p000',
    ref: '/',
    onload: () => import('./v0')
  },

  {
    id: '@p111',
    reducer: () => require('./reducer2').default
  },
  {
    id: '@p0-menu-0',
    point: '@menu',
    onload: () => ({ label: 'P0', href: '/p000' })
  }
]
