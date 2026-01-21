import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import '../styles/Calculator.css'

interface CalculatorState {
  display: string
  previousValue: number | null
  operation: string | null
  newNumber: boolean
}

function Calculator() {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    newNumber: true,
  })

  const [history, setHistory] = useLocalStorage<string[]>('calculatorHistory', [])

  const handleNumber = (num: string) => {
    setState((prevState) => ({
      ...prevState,
      display: prevState.newNumber ? num : prevState.display + num,
      newNumber: false,
    }))
  }

  const handleDecimal = () => {
    setState((prevState) => {
      if (prevState.display.includes('.')) return prevState
      return {
        ...prevState,
        display: prevState.newNumber ? '0.' : prevState.display + '.',
        newNumber: false,
      }
    })
  }

  const handleOperation = (nextOperation: string) => {
    const inputValue = parseFloat(state.display)

    if (state.previousValue === null) {
      setState((prevState) => ({
        ...prevState,
        previousValue: inputValue,
        operation: nextOperation,
        newNumber: true,
      }))
    } else if (state.operation) {
      const result = calculate(state.previousValue, inputValue, state.operation)
      setState({
        display: String(result),
        previousValue: result,
        operation: nextOperation,
        newNumber: true,
      })
    }
  }

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+':
        return prev + current
      case '-':
        return prev - current
      case '*':
        return prev * current
      case '/':
        return prev / current
      case '%':
        return prev % current
      default:
        return current
    }
  }

  const handleEquals = () => {
    if (state.operation && state.previousValue !== null) {
      const inputValue = parseFloat(state.display)
      const result = calculate(state.previousValue, inputValue, state.operation)
      const calculation = `${state.previousValue} ${state.operation} ${inputValue} = ${result}`
      setHistory([calculation, ...history.slice(0, 9)])
      setState({
        display: String(result),
        previousValue: null,
        operation: null,
        newNumber: true,
      })
    }
  }

  const handleClear = () => {
    setState({
      display: '0',
      previousValue: null,
      operation: null,
      newNumber: true,
    })
  }

  const handleBackspace = () => {
    setState((prevState) => ({
      ...prevState,
      display:
        prevState.display.length === 1 ? '0' : prevState.display.slice(0, -1),
    }))
  }

  const handleToggleSign = () => {
    setState((prevState) => ({
      ...prevState,
      display: String(parseFloat(prevState.display) * -1),
    }))
  }

  const clearHistory = () => {
    setHistory([])
  }

  const buttons = [
    { label: 'C', action: handleClear, type: 'clear' },
    { label: '←', action: handleBackspace, type: 'operator' },
    { label: '+/-', action: handleToggleSign, type: 'operator' },
    { label: '÷', action: () => handleOperation('/'), type: 'operator' },
    { label: '7', action: () => handleNumber('7'), type: 'number' },
    { label: '8', action: () => handleNumber('8'), type: 'number' },
    { label: '9', action: () => handleNumber('9'), type: 'number' },
    { label: '×', action: () => handleOperation('*'), type: 'operator' },
    { label: '4', action: () => handleNumber('4'), type: 'number' },
    { label: '5', action: () => handleNumber('5'), type: 'number' },
    { label: '6', action: () => handleNumber('6'), type: 'number' },
    { label: '−', action: () => handleOperation('-'), type: 'operator' },
    { label: '1', action: () => handleNumber('1'), type: 'number' },
    { label: '2', action: () => handleNumber('2'), type: 'number' },
    { label: '3', action: () => handleNumber('3'), type: 'number' },
    { label: '+', action: () => handleOperation('+'), type: 'operator' },
    { label: '0', action: () => handleNumber('0'), type: 'number', wide: true },
    { label: '.', action: handleDecimal, type: 'number' },
    { label: '=', action: handleEquals, type: 'equals' },
  ]

  return (
    <div className="calculator-container">
      <h2>Calculator</h2>

      <div className="calculator-layout">
        <div className="calculator-main">
          <div className="calculator-display">{state.display}</div>

          <div className="calculator-buttons">
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.action}
                className={`calc-button ${btn.type} ${btn.wide ? 'wide' : ''}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="calculator-history">
          <div className="history-header">
            <h3>History</h3>
            <button onClick={clearHistory} className="clear-history-btn">
              Clear
            </button>
          </div>
          <div className="history-list">
            {history.length > 0 ? (
              history.map((calc, idx) => (
                <div key={idx} className="history-item">
                  {calc}
                </div>
              ))
            ) : (
              <p className="empty-message">No calculations yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calculator
