/**************************************************
 * Created by nanyuantingfeng on 2018/7/12 17:06.
 **************************************************/

export default [
  {
    id: '@p4',
    path: '/p4',
    ref: '/',
    onload: () => import('./View'),
    dependencies: ['@p0']
  },

  {
    point: '@menu',
    onload: async () => {
      return { label: 'P4', href: '/p4/public' }
    }
  }
]
