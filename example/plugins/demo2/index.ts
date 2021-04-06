/**************************************************
 * Created by nanyuantingfeng on 2018/7/5 11:13.
 **************************************************/

export default [
  {
    id: '@p2',
    path: '/p2',
    ref: '/',
    onload: () => {
      console.log('---------------------------->>>>onload:@p2')
      return import('./View')
    },
    dependencies: ['@p0']
  },

  {
    point: '@menu',
    onload: async (app: any) => {
      if (!app.needmenuP2) {
        return null
      }

      return { label: 'P2', href: '/p2' }
    }
  }
]
