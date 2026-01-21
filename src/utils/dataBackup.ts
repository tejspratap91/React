/**
 * Data Export/Import Utilities
 * Allows users to backup and restore all application data as JSON
 */

export interface BackupData {
  timestamp: string
  todos: any[]
  notes: any[]
  transactions: any[]
  weatherHistory: any
  calculatorHistory: string[]
  timerLaps: number[]
  progressBars: any[]
  activeTab: string
  darkMode: boolean
}

/**
 * Export all application data as JSON file
 */
export const exportAllData = (): void => {
  try {
    const backupData: BackupData = {
      timestamp: new Date().toISOString(),
      todos: JSON.parse(localStorage.getItem('todos') || '[]'),
      notes: JSON.parse(localStorage.getItem('notes') || '[]'),
      transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
      weatherHistory: JSON.parse(localStorage.getItem('weatherHistory') || '{}'),
      calculatorHistory: JSON.parse(localStorage.getItem('calculatorHistory') || '[]'),
      timerLaps: JSON.parse(localStorage.getItem('timerLaps') || '[]'),
      progressBars: JSON.parse(localStorage.getItem('progressBars') || '[]'),
      activeTab: localStorage.getItem('activeTab') || 'todo',
      darkMode: localStorage.getItem('darkMode') === 'true',
    }

    const dataStr = JSON.stringify(backupData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `react-hub-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting data:', error)
    alert('Failed to export data')
  }
}

/**
 * Import data from JSON file
 */
export const importData = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const backupData: BackupData = JSON.parse(content)

        // Validate data structure
        if (!backupData.timestamp) {
          alert('Invalid backup file')
          resolve(false)
          return
        }

        // Restore all data
        localStorage.setItem('todos', JSON.stringify(backupData.todos))
        localStorage.setItem('notes', JSON.stringify(backupData.notes))
        localStorage.setItem('transactions', JSON.stringify(backupData.transactions))
        localStorage.setItem('weatherHistory', JSON.stringify(backupData.weatherHistory))
        localStorage.setItem('calculatorHistory', JSON.stringify(backupData.calculatorHistory))
        localStorage.setItem('timerLaps', JSON.stringify(backupData.timerLaps))
        localStorage.setItem('progressBars', JSON.stringify(backupData.progressBars))
        localStorage.setItem('activeTab', backupData.activeTab)
        localStorage.setItem('darkMode', String(backupData.darkMode))

        alert('✅ Data restored successfully! Please refresh the page.')
        resolve(true)
      } catch (error) {
        console.error('Error importing data:', error)
        alert('Failed to import data. Invalid file format.')
        resolve(false)
      }
    }
    reader.readAsText(file)
  })
}

/**
 * Clear all application data
 */
export const clearAllData = (): void => {
  if (window.confirm('⚠️ This will delete ALL your data. Are you sure?')) {
    localStorage.clear()
    alert('All data cleared! Please refresh the page.')
  }
}

/**
 * Get data summary statistics
 */
export const getDataSummary = (): string => {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]')
  const notes = JSON.parse(localStorage.getItem('notes') || '[]')
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
  const progressBars = JSON.parse(localStorage.getItem('progressBars') || '[]')

  return `
📊 Data Summary:
  • Todos: ${todos.length}
  • Notes: ${notes.length}
  • Transactions: ${transactions.length}
  • Progress Bars: ${progressBars.length}
  • Backup Date: ${new Date().toLocaleDateString()}
  `
}
