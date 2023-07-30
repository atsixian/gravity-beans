import {
  clamp,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
} from 'framer-motion'
import { UseStoppableTime } from './use-stoppable-time'

export type UseGravityVolume = {
  volume: MotionValue<number>
  setGravity(val: number): void
  resetVelocity(): void
}

export function useGravityVolume(
  t: UseStoppableTime,
  initialVolume: number
): UseGravityVolume {
  const v = useMotionValue(0)
  const g = useSpring(0)

  const volume = useMotionValue(initialVolume)

  useMotionValueEvent(t.val, 'change', () => {
    const dt = 1 / 150
    const oldV = v.get()
    const newV = oldV + g.get() * dt
    const oldVolume = volume.get()

    const vol = clamp(0, 1, oldVolume + ((oldV + newV) / 2) * dt)

    // stop increasing/decreasing velocity when it clamps at two ends
    if (vol === 0 || vol === 1) {
      resetVelocity()
    } else {
      v.set(newV)
    }

    volume.set(vol)
  })

  const setGravity = (val: number) => {
    g.set(val)
  }

  const resetVelocity = () => {
    v.set(0)
  }

  return {
    volume,
    setGravity,
    resetVelocity,
  }
}
