/**************************************************
 * Created by nanyuantingfeng on 2018/7/11 19:50.
 **************************************************/


export default [
  {
    id: '@p7',
    path: '/p7',
    ref: '/',
    exact: true,
    onload: () => import('./DEMO'),
    dependencies: ['@p0'],
    onready() {
      console.log('---------------------------->>>>onready:@p7')
    }
  },

  {
    path: '/p7/a',
    ref: '/',
    exact: true,
    onload: () => import('./DEMO2'),
    dependencies: ['@p0']
  },

  {
    point: '@menu',
    onload: async () => {
      return { label: 'P7', href: '/p7' }
    }
  }
]
