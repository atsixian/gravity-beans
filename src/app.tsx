import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useTransform,
} from 'framer-motion'
import {
  MotionPermissionStatus,
  useDeviceMotion,
  UseDeviceMotionParams,
} from 'hooks/use-device-motion'
import { useGravityVolume } from 'hooks/use-gravity-volume'
import { useSoundSwitcher } from 'hooks/use-sound-switcher'
import { useStoppableTime } from 'hooks/use-stoppable-time'
import IconHearing from 'icon-hearing'
import IconPhoneRotate from 'icon-phone-rotate'
import { IconVolumeDown, IconVolumeUp } from 'icon-volume'
import { useEffect, useRef, useState } from 'react'

function App() {
  const initialVolume = 0.5

  const sounds = useSoundSwitcher({
    slow: {
      src: '/coffee-bean-slow.mp3',
      loop: true,
      volume: initialVolume,
    },
    mid: {
      src: '/coffee-bean-mid.mp3',
      loop: true,
      volume: initialVolume,
    },
    fast: {
      src: '/coffee-bean-fast.mp3',
      loop: true,
      volume: initialVolume,
    },
  })

  const t = useStoppableTime()
  const gravityVolume = useGravityVolume(t, initialVolume)
  const volume = gravityVolume.volume

  const sliderWidth = useTransform(volume, [0, 1], [0, 100])
  const sliderHeight = useTransform(volume, [0, 0.1], [60, 100])
  const gradientRadius = useTransform(volume, [0, 1], [20, 100])
  const gradientOpacity = useTransform(volume, [0, 1], [0.2, 0])

  const [status, setStatus] = useState<MotionPermissionStatus>('unknown')

  useMotionValueEvent(volume, 'change', latest => {
    if (sounds.isPlaying) {
      sounds.play(latest < 0.4 ? 'slow' : latest > 0.6 ? 'fast' : 'mid')
      sounds.volume(latest)
    }
  })

  const isMotionSupported = useRef(false)

  const handleMotionChange: UseDeviceMotionParams['onChange'] = event => {
    isMotionSupported.current = true
    if (event.accelerationIncludingGravity?.x) {
      gravityVolume.setGravity(event.accelerationIncludingGravity.x)
    }
  }

  const handleMotionStart = () => {
    startUpdatingDeviceMotion()
    t.start()
    sounds.play(!sounds.current() ? 'fast' : undefined)
  }

  useEffect(() => {
    if (status === 'granted') {
      handleMotionStart()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const {
    startUpdatingDeviceMotion,
    stopUpdatingDeviceMotion,
    requestPermission,
  } = useDeviceMotion({
    onChange: handleMotionChange,
  })

  return (
    <div>
      <div className="flex h-screen flex-col items-center justify-center text-white before:absolute before:inset-0 before:-z-10 before:h-full before:w-full before:bg-[url('/bg.jpg')] before:bg-cover before:content-['']">
        <motion.div
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full touch-none"
          style={{
            background: useMotionTemplate`
            radial-gradient(circle at center, hsla(0, 0%, 0%, ${gradientOpacity}) ${gradientRadius}%, black)
            `,
          }}
        ></motion.div>

        <div className="mt-auto flex flex-col items-center gap-2">
          <motion.button
            layout
            className="flex gap-2 rounded-full border border-stone-300 bg-stone-500 px-3 py-2"
            onClick={async () => {
              if (status !== 'unknown') {
                if (sounds.isPlaying) {
                  t.stop()
                  sounds.pause()
                  gravityVolume.resetVelocity()
                  stopUpdatingDeviceMotion()
                } else {
                  handleMotionStart()
                }
                return
              }

              // first time
              const res = await requestPermission()

              if (res === 'denied') {
                setStatus('denied')
                return
              }

              handleMotionStart()

              // a hacky way to check if the device has the required hardware
              // we only know if it's available once the change handler is called
              setTimeout(() => {
                if (res === 'granted' && !isMotionSupported.current) {
                  setStatus('nodevice')
                } else {
                  setStatus('granted')
                }
              }, 100)
            }}
          >
            <motion.span
              key={sounds.isPlaying ? 'Pause' : 'Play'}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
            >
              {sounds.isPlaying ? 'Pause' : 'Play'}
            </motion.span>
          </motion.button>

          <div className="relative flex h-11 w-80 items-center justify-start overflow-hidden rounded-full bg-stone-400 p-1">
            <motion.div
              className="h-full w-full overflow-hidden rounded-full bg-stone-800"
              style={{
                width: useMotionTemplate`${sliderWidth}%`,
                height: useMotionTemplate`${sliderHeight}%`,
              }}
            ></motion.div>
          </div>

          {(status === 'granted' || status === 'nodevice') && (
            <p className="flex items-center gap-1 text-sm">
              <IconHearing className="h-5 w-5" />
              Unmute for a surprise
            </p>
          )}
          {status === 'granted' && (
            <p className="flex items-center gap-1 text-sm">
              <IconPhoneRotate className="h-5 w-5" />
              Tilt to pour some coffee beans
            </p>
          )}

          {status === 'nodevice' && (
            <div>
              <div className="mt-4 flex items-center justify-center">
                <button
                  className="border p-2"
                  onClick={() => {
                    gravityVolume.setGravity(-2)
                  }}
                >
                  <IconVolumeDown className="w-6" aria-label="volume down" />
                </button>
                <button
                  className="border p-2"
                  onClick={() => {
                    gravityVolume.setGravity(2)
                  }}
                >
                  <IconVolumeUp className="w-6" aria-label="volume up" />
                </button>
              </div>
              <p className="mt-2 text-center text-sm">
                Looks like you&apos;re on a desktop. <br />
                Try running it on a phone or tablet to see gravity in action.
                <br />
                But you can still play with the volume button👀
              </p>
            </div>
          )}
        </div>

        <div className="prose prose-invert mb-4 mt-auto text-center [text-shadow:0_2px_40px_#000] prose-p:m-0 prose-p:text-sm prose-p:text-white">
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
