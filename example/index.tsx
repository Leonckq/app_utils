/**************************************************
 * Created by nanyuantingfeng on 2018/7/5 14:12.
 **************************************************/
import 'todomvc-common/base.css'
import 'todomvc-app-css/index.css'
import './style.css'

/*const mobx = require('mobx')
const installDevTools = require('mobx-formatters').default
installDevTools(mobx)*/

import React from 'react'
import { app, renderAsApp, renderToBody } from '../src'

app

  .use(import('./plugins/login'))
  .use(import('./plugins/layout'))
  .use(import('./plugins/demo0'))
  .use(import('./plugins/demo1'))
  .use(import('./plugins/demo2'))
  .use(import('./plugins/demo3'))
  .use(import('./plugins/demo4'))
  .use(import('./plugins/demo5'))
  .use(import('./plugins/demo6'))
  .use(import('./plugins/demo7'))
  .use(import('./plugins/demo8'))

app.useConfig('router.fallback', '<loading>')

if (process.env.NODE_ENV === 'development') {
  // require('@ekuaibao/mobx-remotedev').spydev({ name: 'MobXStore' })(app.store)
}

app.hook('onafter', () => {
  renderToBody(<div id={'xxxxxxxx'} />)
});


;(async function() {
  const dom = await app.callback()
  await renderAsApp(dom)
})()
