import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import '../styles/TodoList.css'

interface TodoItem {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

function TodoList() {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('todos', [])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false,
          createdAt: new Date(),
        },
      ])
      setInputValue('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'active' ? !todo.completed :
      filter === 'completed' ? todo.completed :
      true
    
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    active: todos.filter((t) => !t.completed).length,
  }

  return (
    <div className="todo-container">
      <h2>Todo List</h2>
      
      <div className="todo-stats">
        <div className="stat">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.active}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      <div className="todo-input-group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          className="todo-input"
        />
        <button onClick={addTodo} className="todo-add-btn">
          ➕ Add
        </button>
      </div>

      <div className="todo-search-group">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search todos..."
          className="todo-search-input"
        />
      </div>

      <div className="todo-filters">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="todo-list">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox"
              />
              <span className="todo-text">{todo.text}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="todo-delete-btn"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <p className="empty-message">
            {filter === 'all' && 'No todos yet. Add one to get started!'}
            {filter === 'active' && 'All todos completed! 🎉'}
            {filter === 'completed' && 'No completed todos yet.'}
          </p>
        )}
      </div>
    </div>
  )
}

export default TodoList
