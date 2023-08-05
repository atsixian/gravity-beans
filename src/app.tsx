import { VolumeBar } from 'volume-bar'
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
import { useState } from 'react'

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

  const gradientRadius = useTransform(volume, [0, 1], [20, 100])
  const gradientOpacity = useTransform(volume, [0, 1], [0.2, 0])

  const [status, setStatus] = useState<MotionPermissionStatus | null>(null)

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )

  useMotionValueEvent(volume, 'change', latest => {
    if (sounds.isPlaying) {
      sounds.play(latest < 0.4 ? 'slow' : latest > 0.6 ? 'fast' : 'mid')
      sounds.volume(latest)
    }
  })

  const handleMotionChange: UseDeviceMotionParams['onChange'] = event => {
    if (event.accelerationIncludingGravity?.x) {
      gravityVolume.setGravity(event.accelerationIncludingGravity.x)
    }
  }

  const handleMotionStart = () => {
    startUpdatingDeviceMotion()
    t.start()
    sounds.play(!sounds.current() ? 'fast' : undefined)
  }

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
          {sounds.isLoaded ? (
            <motion.button
              layout
              className="flex gap-2 rounded-full border border-stone-300 bg-stone-500 px-3 py-2"
              onClick={async () => {
                if (sounds.isPlaying) {
                  t.stop()
                  sounds.pause()
                  gravityVolume.resetVelocity()
                  stopUpdatingDeviceMotion()
                } else if (!sounds.current()) {
                  // first time
                  const res = await requestPermission()
                  setStatus(res)
                  if (res === 'granted') {
                    handleMotionStart()
                  }
                } else {
                  handleMotionStart()
                }
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
          ) : (
            <p>Loading sound...</p>
          )}

          <VolumeBar drag={!isMobile} gravityVolume={gravityVolume} />

          {status === 'granted' && (
            <>
              <p className="flex items-center gap-1 text-sm">
                <IconHearing className="h-5 w-5" />
                Unmute for a surprise
              </p>

              {isMobile ? (
                <p className="flex items-center gap-1 text-sm">
                  <IconPhoneRotate className="h-5 w-5" />
                  Tilt to pour coffee beans
                </p>
              ) : (
                <p className="text-center text-sm">
                  Looks like you&apos;re on a desktop. <br />
                  Try it on a phone or tablet to see gravity in action.
                  <br />
                  For now, try dragging it👀
                </p>
              )}
            </>
          )}
        </div>

        <div className="prose prose-invert mb-4 mt-auto text-center [text-shadow:0_2px_40px_#000] prose-p:m-0 prose-p:text-sm prose-p:text-white">
          <h1 className="mb-3 text-2xl md:text-3xl">Gravity Beans</h1>
          <p>
            Made by{' '}
            <a href="https://twitter.com/noworkforsixian/status/1685622298118963200?s=20">
              Sixian
            </a>
          </p>
          <p>
            <a href="https://www.buymeacoffee.com/sixianli">Buy me a coffee</a>,
            with your beans🤎
          </p>
          <p className="!mt-3">
            Photo by{' '}
            <a href="https://unsplash.com/@lazares?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Lazarescu Alexandra
            </a>{' '}
            on{' '}
            <a href="https://unsplash.com/photos/AZJrf0D6Vvo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Unsplash
            </a>
          </p>
          <p>
            <a href="https://github.com/atsixian/gravity-beans">GitHub</a>
            {' · '}
            <a href="https://twitter.com/share?text=Tilt to pour some coffee beans. Volume controlled by gravity. @noworkforsixian&url=https://gravity-beans.sixian.li">
              Share to Twitter
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
