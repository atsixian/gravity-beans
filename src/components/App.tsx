import { useCallback, useState } from 'react'
import Sketch from 'react-p5'

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

  const setup = (p5, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef)
  }
  const draw = p5 => {
    p5.background(240)
    p5.ellipse(50, 50, 70, 70)
  }
  return (
    <div className="grid h-screen place-items-center">
      <Sketch className="absolute inset-0 -z-10" setup={setup} draw={draw} />
      <button
        className="text-white"
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
      <p className="text-white">
        {motionEvent?.accelerationIncludingGravity?.x}
      </p>
    </div>
  )
}

export default App
