import { useRef, useState } from 'react'
import closeIcon from './assets/CloseIcon.svg'
import minusIcon from './assets/minusIcon.svg'
import plusIcon from './assets/plusIcon.svg'
import { useEffect } from 'react'

const formatPomodoro = seconds => {
  let formatMinutes = Math.floor(seconds / 60)
  let formatSeconds = seconds % 60
  formatMinutes = formatMinutes < 10 ? '0' + formatMinutes : formatMinutes
  formatSeconds = formatSeconds < 10 ? '0' + formatSeconds : formatSeconds
  return [formatMinutes, formatSeconds]
}

const progressBarCalc = (settings, seconds, minutes) => {
  if (settings) return 0
  const progress = (seconds / (minutes * 60)) * 100
  const revertProgress = 100 - progress

  return revertProgress.toFixed(2)
}

export default function App() {
  const [minutes, setMinutes] = useState(50)
  const [minutesBreak, setMinutesBreak] = useState(10)
  const [runningBreakTime, setRunningBreakTime] = useState(false)
  const [seconds, setSeconds] = useState(minutes * 60)
  const [stop, setStop] = useState(true)
  const [start, setStart] = useState(false)
  const [settings, setSettings] = useState(false)
  const [settingsToggle, setSettingsToggle] = useState(false)
  const [sessionsToggle, setSessionsToggle] = useState(false)
  const [sessions, setSessions] = useState(1)
  const [sessionsCount, setSessionsCount] = useState(0)

  const intervalRef = useRef()

  useEffect(() => {
    if (!start) return

    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev === 0) {
          if (runningBreakTime) {
            setRunningBreakTime(false)
            setSessionsCount(prev => prev + 1)
            return minutes * 60
          } else {
            setRunningBreakTime(true)
            return minutesBreak * 60
          }
        } else {
          return prev - 1
        }
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [start, minutesBreak, minutes, runningBreakTime])

  useEffect(() => {
    setSeconds(minutes * 60)
  }, [minutes])

  const handlePause = () => {
    clearInterval(intervalRef.current)
    setStart(!start)
  }

  const handleStop = () => {
    setSeconds(minutes * 60)
    setStop(true)
    setStart(false)
    clearInterval(intervalRef.current)
  }

  const handleStart = () => {
    setStart(true)
    setStop(false)
  }

  const handlePomodoroSettings = () => {
    setSettings(!settings)
    setSettingsToggle(false)
  }

  const handleNext = () => {
    setSettingsToggle(!settingsToggle)
  }

  const handleMinus = () => {
    const set = settingsToggle ? setMinutesBreak : setMinutes
    set(prev => (prev === 1 ? prev : prev - 1))
  }

  const handlePlus = () => {
    const set = settingsToggle ? setMinutesBreak : setMinutes
    set(prev => prev + 1)
  }

  const handleSessions = () => {
    setSessionsToggle(!sessionsToggle)
  }

  const [formatMinutes, formatSeconds] = formatPomodoro(
    settingsToggle ? minutesBreak * 60 : seconds
  )

  return (
    <div className="w-[800px] rounded-3xl p-12 pomodoroContainer h-[450px]">
      <div className="flex justify-between pb-5 items-center">
        <h1 className="text-4xl">
          {runningBreakTime ? 'Break Time' : 'Focus Time'}
        </h1>
        <img
          src={closeIcon}
          className="w-7 cursor-pointer"
          onClick={handlePomodoroSettings}
        />
      </div>

      <div className="w-full h-3 bg-[#353535] rounded overflow-hidden">
        <span
          className="h-full bg-white block transition-[width]"
          style={{ width: `${progressBarCalc(settings, seconds, minutes)}%` }}
        />
      </div>

      {settings ? (
        <div className="flex flex-col items-center pt-1">
          <h2 className="text-3xl text-[#4e4e4e] mb-5">
            Set up{' '}
            {sessionsToggle ? 'sessions' : settingsToggle ? 'break' : 'focus'}{' '}
            time
          </h2>
          {sessionsToggle ? (
            <div>
              <div className="flex gap-10 w-full justify-center">
                <button
                  className="text-6xl"
                  onClick={() =>
                    setSessions(prev => (prev === 1 ? prev : prev - 1))
                  }
                >
                  <img
                    src={minusIcon}
                    className="w-16 border-2 p-2 rounded-xl"
                  />
                </button>
                <span className="text-9xl w-[200px] font-semibold mb-8 text-center">
                  {sessions}
                </span>
                <button onClick={() => setSessions(prev => prev + 1)}>
                  <img
                    src={plusIcon}
                    className="w-16 border-2 p-2 rounded-xl"
                  />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-10 w-full justify-center">
              <button className="text-6xl" onClick={handleMinus}>
                <img src={minusIcon} className="w-16 border-2 p-2 rounded-xl" />
              </button>
              <div className="text-9xl font-semibold w-full mb-8 text-center">
                <span>{formatMinutes}</span>
                <span>:</span>
                <span>{formatSeconds}</span>
              </div>
              <button onClick={handlePlus}>
                <img src={plusIcon} className="w-16 border-2 p-2 rounded-xl" />
              </button>
            </div>
          )}
          <div className="flex gap-3">
            {!sessionsToggle && (
              <button
                className="border-[#353535] border-2 rounded-lg py-2 px-6 flex-1"
                onClick={handleNext}
              >
                Next
              </button>
            )}
            <button
              className="border-[#353535] border-2 rounded-lg py-2 px-6 flex-1"
              onClick={handleSessions}
            >
              {sessionsToggle ? 'Exit' : 'sessions'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center pt-8">
          <span className="text-4xl">
            {sessionsCount}/{sessions} sessions
          </span>
          <div className="text-9xl font-semibold flex max-w-[320px] w-full mb-8">
            <span className="flex-1">{formatMinutes}:</span>
            <span className="flex-1">{formatSeconds}</span>
          </div>
          <div className="flex gap-3 max-w-[300px] w-full text-3xl text-[#b3b3b3]">
            {stop ? (
              <button
                className="border-[#353535] border-2 rounded-lg py-2 px-6 flex-1"
                onClick={handleStart}
              >
                Start
              </button>
            ) : (
              <>
                <button
                  className="border-[#353535] border-2 rounded-lg py-2 px-6 flex-1"
                  onClick={handlePause}
                >
                  {start ? 'Pause' : 'Continue'}
                </button>
                <button
                  className="border-[#353535] border-2 rounded-lg py-2 px-6 flex-1"
                  onClick={handleStop}
                >
                  Stop
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
