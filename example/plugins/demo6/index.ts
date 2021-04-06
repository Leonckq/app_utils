/**************************************************
 * Created by nanyuantingfeng on 2018/7/11 19:50.
 **************************************************/

export default [
  {
    id: '@p6',
    path: '/p6',
    ref: '/',
    onload: () => import('./DEMO'),
    dependencies: ['@p0'],
    onready() {
      console.log('---------------------------->>>>onready:@p6')
    }
  },

  {
    point: '@demo',
    onload: async () => {
      return { demo: { demo: 999 } }
    }
  },

  {
    point: '@menu',
    onload: async () => {
      return { label: 'P6', href: '/p6' }
    }
  }
]
