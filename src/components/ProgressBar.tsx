import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import '../styles/ProgressBar.css'

interface ProgressItem {
  id: string
  label: string
  value: number
  color: string
}

function ProgressBar() {
  const [progressBars, setProgressBars] = useLocalStorage<ProgressItem[]>('progressBars', [
    { id: '1', label: 'Project 1', value: 45, color: '#3498db' },
    { id: '2', label: 'Project 2', value: 72, color: '#2ecc71' },
    { id: '3', label: 'Project 3', value: 28, color: '#e74c3c' },
  ])

  const [newLabel, setNewLabel] = useState('')
  const [newColor, setNewColor] = useState('#3498db')

  const updateProgress = (id: string, newValue: number) => {
    setProgressBars(
      progressBars.map((bar) =>
        bar.id === id ? { ...bar, value: Math.min(100, Math.max(0, newValue)) } : bar
      )
    )
  }

  const addProgressBar = () => {
    if (newLabel.trim()) {
      const newId = Date.now().toString()
      setProgressBars([
        ...progressBars,
        {
          id: newId,
          label: newLabel,
          value: 0,
          color: newColor,
        },
      ])
      setNewLabel('')
      setNewColor('#3498db')
    }
  }

  const deleteProgressBar = (id: string) => {
    setProgressBars(progressBars.filter((bar) => bar.id !== id))
  }

  const resetAll = () => {
    setProgressBars(progressBars.map((bar) => ({ ...bar, value: 0 })))
  }

  const completeAll = () => {
    setProgressBars(progressBars.map((bar) => ({ ...bar, value: 100 })))
  }

  const colorMap: { [key: string]: string } = {
    '#3498db': 'Blue',
    '#2ecc71': 'Green',
    '#e74c3c': 'Red',
    '#f39c12': 'Orange',
    '#9b59b6': 'Purple',
    '#1abc9c': 'Teal',
    '#34495e': 'Gray',
  }

  const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e']

  return (
    <div className="progress-container">
      <h2>Progress Tracker</h2>

      <div className="progress-controls">
        <div className="control-group">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addProgressBar()}
            placeholder="Project name..."
            className="progress-input"
          />
          <select
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="color-select"
          >
            {colors.map((color) => (
              <option key={color} value={color}>
                {colorMap[color]}
              </option>
            ))}
          </select>
          <button onClick={addProgressBar} className="add-btn">
            + Add
          </button>
        </div>

        <div className="action-buttons">
          <button onClick={resetAll} className="reset-btn">
            Reset All
          </button>
          <button onClick={completeAll} className="complete-btn">
            Complete All
          </button>
        </div>
      </div>

      <div className="progress-list">
        {progressBars.length > 0 ? (
          progressBars.map((bar) => (
            <div key={bar.id} className="progress-item">
              <div className="progress-header">
                <label className="progress-label">{bar.label}</label>
                <span className="progress-percentage">{bar.value}%</span>
              </div>

              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${bar.value}%`,
                    backgroundColor: bar.color,
                  }}
                />
              </div>

              <div className="progress-input-group">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bar.value}
                  onChange={(e) => updateProgress(bar.id, parseInt(e.target.value))}
                  className="progress-slider"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={bar.value}
                  onChange={(e) => updateProgress(bar.id, parseInt(e.target.value))}
                  className="progress-number-input"
                />
                <button
                  onClick={() => deleteProgressBar(bar.id)}
                  className="delete-btn"
                  title="Delete"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-message">No progress bars yet. Create one to get started!</p>
        )}
      </div>

      <div className="progress-stats">
        <div className="stat">
          <span className="stat-label">Total Progress:</span>
          <span className="stat-value">
            {progressBars.length > 0
              ? Math.round(
                  progressBars.reduce((sum, bar) => sum + bar.value, 0) / progressBars.length
                )
              : 0}
            %
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Tasks:</span>
          <span className="stat-value">{progressBars.length}</span>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
