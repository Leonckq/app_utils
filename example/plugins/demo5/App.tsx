/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-27 20:32
 */
import 'todomvc-common/base.css'
import 'todomvc-app-css/index.css'

import React from 'react'
import { applySnapshot, Store } from '@ekuaibao/mmlpx'
import { configure } from 'mobx'

import TodoApp from './containers/TodoApp'
import TodosLoder from './stores/TodosLoder'

applySnapshot(TodosLoder.getSnapshot())

export default TodoApp
