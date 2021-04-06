/**************************************************
 * Created by nanyuantingfeng on 2018/7/12 17:06.
 **************************************************/

export default [
  {
    id: '@p5',
    path: '/p5',
    ref: '/',
    onload: () => import('./App'),
    dependencies: ['@p0']
  },

  {
    id: '@todostore',
    onfirst: async () => {
      import('./stores/TodosStore')
    }
  },

  {
    point: '@menu',
    onload: async (app: any) => {
      if (app.needmenuP2) {
        return { label: 'P5----X', href: '/p5' }
      }
      return { label: 'P5', href: '/p5' }
    }
  }
]
