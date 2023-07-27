import { useCallback, useState } from 'react'
import { ReactP5Wrapper, Sketch } from '@p5-wrapper/react'

const sketch: Sketch = p => {
  p.setup = () => p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)

  p.draw = () => {
    p.background(250)
    p.normalMaterial()
    p.push()
    p.rotateZ(p.frameCount * 0.01)
    p.rotateX(p.frameCount * 0.01)
    p.rotateY(p.frameCount * 0.01)
    p.plane(100)
    p.pop()
  }
}
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
    <div className="grid h-screen place-items-center">
      <div className="absolute inset-0 -z-10">
        <ReactP5Wrapper sketch={sketch} />
      </div>
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
