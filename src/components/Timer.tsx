import { useState, useEffect, useRef } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import '../styles/Timer.css'

type TimerMode = 'timer' | 'stopwatch'

function Timer() {
  const [mode, setMode] = useState<TimerMode>('timer')
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [input, setInput] = useState('5')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [laps, setLaps] = useLocalStorage<number[]>('timerLaps', [])
  const [lastLapTime, setLastLapTime] = useState(0)

  // Timer/Stopwatch logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (mode === 'timer' && prevTime <= 0) {
            setIsRunning(false)
            playNotification()
            return 0
          }
          return mode === 'timer' ? prevTime - 1 : prevTime + 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, mode])

  const playNotification = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const handleStartTimer = () => {
    if (mode === 'timer' && time === 0) {
      const minutes = parseInt(input) || 0
      setTime(minutes * 60)
    }
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
    setInput('5')
    setLaps([])
    setLastLapTime(0)
  }

  const handleLap = () => {
    if (mode === 'stopwatch' && isRunning) {
      const lapTime = time - lastLapTime
      setLaps([...laps, lapTime])
      setLastLapTime(time)
    }
  }

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(
        secs
      ).padStart(2, '0')}`
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const formatLapTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode)
    setIsRunning(false)
    setTime(0)
    setLaps([])
    setLastLapTime(0)
  }

  return (
    <div className="timer-container">
      <h2>Timer & Stopwatch</h2>

      <div className="timer-mode-selector">
        <button
          onClick={() => switchMode('timer')}
          className={`mode-btn ${mode === 'timer' ? 'active' : ''}`}
        >
          ⏱️ Timer
        </button>
        <button
          onClick={() => switchMode('stopwatch')}
          className={`mode-btn ${mode === 'stopwatch' ? 'active' : ''}`}
        >
          ⏰ Stopwatch
        </button>
      </div>

      <div className="timer-display-section">
        <div className="timer-display">{formatTime(time)}</div>

        {mode === 'timer' && !isRunning && time === 0 && (
          <div className="timer-input-group">
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Minutes"
              className="timer-input"
              min="1"
              max="999"
            />
            <span>minutes</span>
          </div>
        )}

        <div className="timer-controls">
          <button
            onClick={handleStartTimer}
            className={`control-btn ${isRunning ? 'pause' : 'play'}`}
          >
            {isRunning ? '⏸ Pause' : '▶ Start'}
          </button>
          <button onClick={handleReset} className="control-btn reset">
            🔄 Reset
          </button>
          {mode === 'stopwatch' && (
            <button onClick={handleLap} className="control-btn lap" disabled={!isRunning}>
              🏁 Lap
            </button>
          )}
        </div>
      </div>

      {mode === 'stopwatch' && laps.length > 0 && (
        <div className="laps-section">
          <h3>Laps</h3>
          <div className="laps-list">
            {laps.map((lap, idx) => (
              <div key={idx} className="lap-item">
                <span className="lap-number">Lap {idx + 1}</span>
                <span className="lap-time">{formatLapTime(lap)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Timer
