/***************************************************
 * Created by nanyuantingfeng on 2020/2/17 14:57. *
 ***************************************************/
import { App, IThirdThirdResourceType } from '../../../src'

export default [
  {
    id: '@p8-menu',
    point: '@menu',
    onload: () => ({ label: 'P8', href: '/p8' })
  },

  {
    path: '/p8',
    ref: '/',
    onbefore: (app: App) => {
      app.thirdResources.add({
        id: '0',
        type: 'demo00000',
        source: 'https://www.baidu.com',
        sourceType: IThirdThirdResourceType.IFRAME
      })

      app.thirdResources.add({
        id: '1',
        type: 'demo00000',
        source: 'http://0.0.0.0:8080/page1.html',
        sourceType: IThirdThirdResourceType.IFRAME
      })
    },
    onload: () => import('./P8DEMO')
  }
]
