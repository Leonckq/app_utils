/**************************************************
 * Created by nanyuantingfeng on 2018/7/11 19:50.
 **************************************************/
import { Whispered } from '../../../src'

export default [
  {
    id: '@p3',
    path: '/p3',
    ref: '/',
    onload: () => import('./DEMO'),
    dependencies: ['@p0'],
    onready() {
      console.log('---------------------------->>>>onready:@p3')
    }
  },

  {
    point: '@menu',
    onload: async () => {
      return { label: 'P3', href: '/p3' }
    }
  },

  {
    point: '@xxx',
    onload: app => app.wrapAsLazyComponent(() => import('./LazyedDEMO'))
  }
] as Whispered.Plugin[]
