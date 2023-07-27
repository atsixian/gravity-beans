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
    <div>
      <svg height="0">
        <defs>
          <filter
            id="blurFilter"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="0" edgeMode="duplicate" />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="1 1" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      <div className="flex h-screen items-center justify-center text-white before:absolute before:inset-0 before:-z-10 before:h-full before:w-full before:bg-[url('/bg.jpg')] before:bg-cover before:content-[''] before:[filter:url(#blurFilter)]">
        <div>
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

        <div className="prose prose-invert absolute bottom-10 text-center [text-shadow:0_2px_40px_#000] prose-p:m-0 prose-p:text-sm prose-p:text-white">
          <h1 className="mb-3 text-2xl md:text-3xl">Gravity Volume Slider</h1>
          <p>
            Made by <a href="https://twitter.com/noworkforsixian">Sixian</a>
          </p>
          <p>
            Photo by{' '}
            <a href="https://unsplash.com/@lazares?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Lazarescu Alexandra
            </a>{' '}
            on{' '}
            <a href="https://unsplash.com/photos/AZJrf0D6Vvo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Unsplash
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
