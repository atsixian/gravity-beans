import type { MotionValue } from 'framer-motion'
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useSound } from 'hooks/useSound'
import { useCallback, useState } from 'react'

// for iOS 13+
interface DeviceMotionEventiOS extends DeviceMotionEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

function App() {
  const [motionEvent, setMotionEvent] = useState<DeviceMotionEvent>()
  const [isRunning, setIsRunning] = useState(false)

  const sounds = useSound({
    slow: {
      src: '/coffee-bean-slow.mp3',
      loop: true,
    },
    mid: {
      src: '/coffee-bean-mid.mp3',
      loop: true,
    },
    fast: {
      src: '/coffee-bean-fast.mp3',
      loop: true,
    },
  })

  const volume: MotionValue<number> = useSpring(1, {
    bounce: 0,
    duration: 8000,
  })

  const sliderWidth = useTransform(volume, [0, 1], [0, 100])
  const sliderHeight = useTransform(volume, [0, 0.1], [60, 100])
  const gradientRadius = useTransform(volume, [0, 1], [20, 100])
  const gradientOpacity = useTransform(volume, [0, 1], [0.2, 0])

  useMotionValueEvent(volume, 'change', latest => {
    sounds.play(latest < 0.3 ? 'slow' : latest > 0.7 ? 'fast' : 'mid')
    sounds.volume(latest)
  })

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    setMotionEvent(event)
  }, [])

  return (
    <div>
      <div className="flex h-screen items-center justify-center text-white before:absolute before:inset-0 before:-z-10 before:h-full before:w-full before:bg-[url('/bg.jpg')] before:bg-cover before:content-['']">
        <motion.div
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full touch-none"
          style={{
            background: useMotionTemplate`
            radial-gradient(circle at center, hsla(0, 0%, 0%, ${gradientOpacity}) ${gradientRadius}%, black)
            `,
          }}
        ></motion.div>
        <div>
          <div className="relative flex h-11 w-80 items-center justify-start overflow-hidden rounded-full bg-stone-400 p-1">
            <motion.div
              className="h-full w-full overflow-hidden rounded-full bg-stone-800"
              style={{
                width: useMotionTemplate`${sliderWidth}%`,
                height: useMotionTemplate`${sliderHeight}%`,
              }}
            ></motion.div>
          </div>

          <div className="mt-4 flex items-center justify-center">
            <button
              onClick={() => {
                if (sounds.isPlaying()) {
                  sounds.pause()
                } else {
                  sounds.play('fast')
                }
              }}
            >
              Play
            </button>
            <button
              className="border p-3"
              onClick={() => {
                volume.set(1)
              }}
            >
              +
            </button>
            <button
              className="border p-3"
              onClick={() => {
                volume.set(0)
              }}
            >
              -
            </button>
          </div>

          <button
            className="hidden"
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
          <h1 className="mb-3 text-2xl md:text-3xl">Gravity Beans</h1>
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
