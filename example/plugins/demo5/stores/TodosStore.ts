/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-27 20:43
 */
import { Store } from '@ekuaibao/mmlpx'
import { StoreDebug } from '@ekuaibao/mmlpx-remotedev'
import { action, observable } from 'mobx'
import { Todo } from './Todo'

@StoreDebug('TodosStore')
export default class TodosStore {
  namexxx: string

  constructor(name: string = 'TodosStore') {
    this.namexxx = name
  }

  @observable
  list: Todo[] = []
  private uid = 0

  @action
  addTodo(title: string) {
    this.list.push({
      title,
      completed: false,
      id: this.uid++
    })
  }

  @action
  removeTodo(todo: Todo) {
    this.list.splice(
      this.list.findIndex(v => todo.id === v.id),
      1
    )
  }

  @action
  updateTodo(todo: Todo) {
    this.list.splice(
      this.list.findIndex(v => todo.id === v.id),
      1,
      todo
    )
  }

  @action.bound
  toggleAll(completed: boolean) {
    this.list.forEach(todo => (todo.completed = completed))
  }
}
