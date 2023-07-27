import { useCallback, useState } from 'react'

// for iOS 13+
interface DeviceMotionEventiOS extends DeviceMotionEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

function App() {
  const [motionEvent, setMotionEvent] = useState<DeviceMotionEvent>()
  const [isRunning, setIsRunning] = useState(false)

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    setMotionEvent(event)
  }, [])

  return (
    <div className="grid h-screen w-screen place-items-center">
      <button
        onClick={async () => {
          if (isRunning) {
            window.removeEventListener('devicemotion', handleMotion)
            setIsRunning(false)
            return
          }

          const requestPermission = (
            DeviceMotionEvent as unknown as DeviceMotionEventiOS
          ).requestPermission
          if (typeof requestPermission === 'function') {
            const result = await requestPermission()
            if (result === 'granted') {
              setIsRunning(true)
              window.addEventListener('devicemotion', handleMotion)
            }
          } else {
            setIsRunning(true)
            window.addEventListener('devicemotion', handleMotion)
          }
        }}
      >
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <p>{motionEvent?.accelerationIncludingGravity?.x}</p>
    </div>
  )
}

export default App
