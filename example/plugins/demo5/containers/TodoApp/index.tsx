/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-27 20:35
 */

import { inject } from '@ekuaibao/mmlpx'
import { IReactionDisposer } from 'mobx'
import { observer } from 'mobx-react'
import React, { KeyboardEvent, SFC } from 'react'
import TodoItem from '../../components/TodoItem'
import TodoAppViewModel from './ViewModel'

interface LinkProps {
  selected: boolean
  onClick: () => void
  caption: string
}

const Filter: SFC<LinkProps> = ({ selected, caption, onClick }) => (
  <li>
    <a className={selected ? 'selected' : ''} onClick={onClick} style={{ cursor: 'pointer' }}>
      {caption}
    </a>
  </li>
)

@observer
export default class Index extends React.Component {
  @inject()
  viewModel: TodoAppViewModel

  disposer: IReactionDisposer

  componentDidMount() {
    this.disposer = this.viewModel.enableRedoUndo()
  }

  componentWillUnmount() {
    this.disposer()
  }

  handleNewTodoKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return
    }

    this.viewModel.addTodo()
  }

  render() {
    const {
      inputtingTodo,
      activeTodos,
      onInputChange,
      toggleAll,
      allCompleted,
      visibleTodos,
      editingTodoId,
      onEdit,
      removeTodo,
      updateTodo,
      filter,
      changeFilter,
      completedTodos,
      clearCompleted,
      undo,
      redo,
      canRedo,
      canUndo
    } = this.viewModel

    return (
      <section>
        <div className="todoapp">
          <header className="header">
            <h1>todos</h1>
            <input
              className="new-todo"
              placeholder="What needs to be done?"
              value={inputtingTodo}
              onChange={event => onInputChange(event.target.value)}
              onKeyDown={this.handleNewTodoKeyDown}
              autoFocus={true}
            />
          </header>
          <section className="main">
            <input id="toggleAll" className="toggle-all" type="checkbox" onChange={toggleAll} checked={allCompleted} />
            {visibleTodos.length ? <label htmlFor="toggleAll" /> : null}
            <ul className="todo-list">
              {visibleTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  editing={todo.id === editingTodoId}
                  onEdit={onEdit}
                  onDestroy={removeTodo}
                  onToggle={todo =>
                    updateTodo({
                      ...todo,
                      completed: !todo.completed
                    })
                  }
                  onUpdate={updateTodo}
                  todo={todo}
                />
              ))}
            </ul>
          </section>
          {activeTodos.length || completedTodos.length ? (
            <footer className="footer">
              <span className="todo-count">
                <strong>{activeTodos.length}</strong> {activeTodos.length >= 1 ? 'items' : 'item'} left
              </span>
              <ul className="filters">
                <Filter selected={filter === 'all'} onClick={() => changeFilter('all')} caption={'All'} />
                <Filter selected={filter === 'active'} onClick={() => changeFilter('active')} caption={'Active'} />
                <Filter
                  selected={filter === 'completed'}
                  onClick={() => changeFilter('completed')}
                  caption={'Completed'}
                />
              </ul>
              {completedTodos.length === 0 ? null : (
                <button className="clear-completed" onClick={clearCompleted}>
                  Clear completed
                </button>
              )}
            </footer>
          ) : null}
        </div>

        <aside style={{ textAlign: 'center' }} className="record">
          <button type="button" onClick={redo} disabled={!canRedo}>
            redo
          </button>
          <button type="button" onClick={undo} disabled={!canUndo}>
            undo
          </button>
        </aside>
      </section>
    )
  }
}
