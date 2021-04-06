/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-27 23:07
 */

import { applySnapshot, getSnapshot, inject, onSnapshot } from '@ekuaibao/mmlpx'
import { action, computed, observable, runInAction } from 'mobx'
import TodosLoder from '../../stores/TodosLoder'
import { Todo } from '../../stores/Todo'
import TodosStore from '../../stores/TodosStore'

type Filter = 'all' | 'active' | 'completed'

import { ViewModel } from '@ekuaibao/mmlpx'
import { ViewModelDebug } from '@ekuaibao/mmlpx-remotedev'

@ViewModelDebug('TodoAppViewModel')
export default class TodoAppViewModel {
  @observable
  inputtingTodo = ''
  @observable
  editingTodoId: number | null
  @observable
  filter: Filter = 'all'

  @inject()
  todosStore: TodosStore

  @observable
  private stack: any[] = []
  @observable
  private cursor = 0

  @computed
  get canRedo() {
    return this.stack.length > 1 && 0 <= this.cursor && this.cursor < this.stack.length - 1
  }

  @computed
  get canUndo() {
    return this.stack.length > 1 && 0 < this.cursor && this.cursor < this.stack.length
  }

  @computed
  get allCompleted(): boolean {
    return this.todosStore.list.every(todo => todo.completed)
  }

  @computed
  get activeTodos() {
    return this.todosStore.list.filter(todo => !todo.completed)
  }

  @computed
  get completedTodos() {
    return this.todosStore.list.filter(todo => todo.completed)
  }

  @computed
  get visibleTodos() {
    switch (this.filter) {
      case 'all':
        return this.todosStore.list

      case 'active':
        return this.activeTodos

      case 'completed':
        return this.completedTodos
    }
  }

  @action.bound
  changeFilter(filter: Filter) {
    this.filter = filter
  }

  @action.bound
  onEdit(todo: Todo, editing: boolean) {
    this.editingTodoId = editing ? todo.id : null
  }

  @action.bound
  onInputChange(changedInput: string) {
    this.inputtingTodo = changedInput.trim()
  }

  @action.bound
  addTodo() {
    if (this.inputtingTodo) {
      this.todosStore.addTodo(this.inputtingTodo)
      this.inputtingTodo = ''
    }
  }

  @action.bound
  removeTodo(todo: Todo) {
    this.todosStore.removeTodo(todo)
  }

  @action.bound
  updateTodo(todo: Todo) {
    this.todosStore.updateTodo(todo)
  }

  @action.bound
  toggleAll() {
    this.todosStore.toggleAll(!this.allCompleted)
  }

  @action.bound
  clearCompleted() {
    const todos = [...this.todosStore.list]
    todos.forEach(todo => {
      if (todo.completed) {
        this.todosStore.removeTodo(todo)
      }
    })
  }

  @action.bound
  enableRedoUndo() {
    this.stack.push(getSnapshot())
    // @ts-ignore
    return onSnapshot(snapshot => {
      runInAction(() => {
        this.stack.push(snapshot)
        this.cursor = this.stack.length - 1
        TodosLoder.saveSnapshot(snapshot)
      })
    })
  }

  @action.bound
  redo() {
    applySnapshot(this.stack[++this.cursor])
  }

  @action.bound
  undo() {
    applySnapshot(this.stack[--this.cursor])
  }
}
