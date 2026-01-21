import { useRef } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import TodoList from './components/TodoList'
import WeatherReport from './components/WeatherReport'
import Notepad from './components/Notepad'
import Calculator from './components/Calculator'
import Timer from './components/Timer'
import BudgetManager from './components/BudgetManager'
import ProgressBar from './components/ProgressBar'
import { exportAllData, importData, clearAllData } from './utils/dataBackup'
import './styles/App.css'

type Tab = 'todo' | 'weather' | 'notepad' | 'calculator' | 'timer' | 'budget' | 'progress'

function App() {
  const [activeTab, setActiveTab] = useLocalStorage<Tab>('activeTab', 'todo')
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'todo', label: 'Todo List', icon: '✓' },
    { id: 'weather', label: 'Weather', icon: '🌤️' },
    { id: 'notepad', label: 'Notepad', icon: '📝' },
    { id: 'calculator', label: 'Calculator', icon: '🧮' },
    { id: 'timer', label: 'Timer', icon: '⏱️' },
    { id: 'budget', label: 'Budget', icon: '💰' },
    { id: 'progress', label: 'Progress', icon: '📊' },
  ]

  const renderComponent = () => {
    switch (activeTab) {
      case 'todo':
        return <TodoList />
      case 'weather':
        return <WeatherReport />
      case 'notepad':
        return <Notepad />
      case 'calculator':
        return <Calculator />
      case 'timer':
        return <Timer />
      case 'budget':
        return <BudgetManager />
      case 'progress':
        return <ProgressBar />
      default:
        return <TodoList />
    }
  }

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>React Component Hub</h1>
            <p>Explore all core React concepts in one place</p>
          </div>
          <button
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <nav className="app-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
        
        <div className="nav-utilities">
          <button
            className="utilities-btn"
            title="Export Data"
            onClick={exportAllData}
          >
            💾
          </button>
          <button
            className="utilities-btn"
            title="Import Data"
            onClick={() => fileInputRef.current?.click()}
          >
            📂
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                importData(e.target.files[0])
              }
            }}
          />
          <button
            className="utilities-btn danger"
            title="Clear All Data"
            onClick={clearAllData}
          >
            🗑️
          </button>
        </div>
      </nav>

      <main className="app-main">
        <div className="component-container">
          {renderComponent()}
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2026 React Component Hub | Demonstrating React Best Practices</p>
      </footer>
    </div>
  )
}

export default App
