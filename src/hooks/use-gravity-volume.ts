import { MotionValue, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { UseStoppableTime } from './use-stoppable-time'

type UseGravityVolume = {
  volume: MotionValue<number>
  setGravity(val: number): void
  resetVelocity(): void
}

export function useGravityVolume(t: UseStoppableTime, initialVolume: number): UseGravityVolume {
  const v = useMotionValue(0)
  const g = useMotionValue(0)

  const volume = useMotionValue(initialVolume)

  useMotionValueEvent(t.val, 'change', () => {
    const dt = 1 / 500
    const oldV = v.get()
    const newV = oldV + g.get() * dt
    const vol = volume.get() + ((oldV + newV) / 2) * dt
    v.set(newV)
    volume.set(Math.max(0, Math.min(1, vol)))
  })

  useMotionValueEvent(volume, 'change', vol => {
    // reset time and velocity when volume animation ends
    if (vol <= 0 || vol >= 1) {
      resetVelocity()
    }
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
