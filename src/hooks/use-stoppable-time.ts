import { useAnimationFrame, MotionValue, useMotionValue } from 'framer-motion'
import { useState } from 'react'

export type UseStoppableTime = {
  reset(): void
  stop(): void
  start(): void
  val: MotionValue<number>
  isRunning: boolean
}

export function useStoppableTime(): UseStoppableTime {
  const [isRunning, setIsRunning] = useState(false)
  const t = useMotionValue(0)

  useAnimationFrame((_, delta) => {
    if (isRunning) {
      t.set(t.get() + delta)
    }
  })
  const reset = () => {
    t.set(0)
  }

  const stop = () => {
    setIsRunning(false)
  }

  const start = () => {
    setIsRunning(true)
  }

  return {
    reset,
    stop,
    start,
    val: t,
    isRunning,
  }
}
