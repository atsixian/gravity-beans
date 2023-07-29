import { MotionValue, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { UseStoppableTime } from './use-stoppable-time'

type UseGravityVolume = {
  volume: MotionValue<number>
  setGravity(val: number): void
}

export function useGravityVolume(t: UseStoppableTime): UseGravityVolume {
  const v = useMotionValue(0)
  const g = useMotionValue(0)

  const volume = useMotionValue(0)

  useMotionValueEvent(t.val, 'change', t => {
    const _t = t / 1000_000 // slow down
    const oldV = v.get()
    const newV = v.get() + g.get() * _t
    const vol = volume.get() + ((oldV + newV) / 2) * _t
    v.set(newV)
    volume.set(Math.max(0, Math.min(1, vol)))
  })

  useMotionValueEvent(volume, 'change', vol => {
    // reset time and velocity when volume animation ends
    if (vol <= 0 || vol >= 1) {
      t.stop()
      t.reset()
      v.set(0)
    }
  })

  const setGravity = (val: number) => {
    g.set(val)
  }

  return {
    volume,
    setGravity,
  }
}
