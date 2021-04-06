/**************************************************
 * Created by nanyuantingfeng on 2018/7/5 11:13.
 **************************************************/
import { Whispered } from '../../../src'
import loadable from '@loadable/component'

export default [
  {
    id: '@p1',
    path: '/p1',
    ref: '/',
    store: {
      key: 'demo1',
      value: () => import('./demo1.store')
    },
    onload: app => {
      console.log('=======================11111111')
      return import('./counter')
    },
    onafter: async () => {
      return import('./MOC').then(module => {
        module.default.newInstance({}, api => {
          console.log('==============moc==api===', api)
        })
      })
    },
    dependencies: ['@p0']
  },
  {
    id: '@p1-menu',
    point: '@menu',
    onload: () => ({ label: 'P1', href: '/p1' })
  },
  {
    resource: '@images',
    value: {
      ['404.png']: require('./404.png')
    }
  },

  {
    resource: '@comps',
    value: {
      ['DY']: () => import('./DY'),
      ['DZ']: loadable(() => import('./DZ'))
    }
  }
] as Whispered.Plugin[]
