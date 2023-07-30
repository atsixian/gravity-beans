import {
  clamp,
  HTMLMotionProps,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from 'framer-motion'
import { UseGravityVolume } from 'hooks/use-gravity-volume'
import { useRef } from 'react'

export function VolumeBar({
  drag,
  gravityVolume,
}: {
  drag: boolean
  gravityVolume: UseGravityVolume
}) {
  const Wrapper = drag ? DraggableBar : 'div'
  const sliderWidth = useTransform(gravityVolume.volume, [0, 1], [0, 100])
  const sliderHeight = useTransform(gravityVolume.volume, [0, 0.1], [60, 100])
  return (
    <Wrapper
      className="relative flex h-11 w-80 items-center justify-start overflow-hidden rounded-full bg-stone-400 p-1"
      gravityVolume={gravityVolume}
    >
      <motion.div
        className="h-full w-full overflow-hidden rounded-full bg-stone-800"
        style={{
          width: useMotionTemplate`${sliderWidth}%`,
          height: useMotionTemplate`${sliderHeight}%`,
        }}
      ></motion.div>
    </Wrapper>
  )
}

export function DraggableBar({
  gravityVolume,
  ...props
}: HTMLMotionProps<'div'> & {
  gravityVolume: UseGravityVolume
}) {
  const rotationAngle = useMotionValue(0)
  const clampedRotationAngle = useTransform(rotationAngle, rad => {
    return clamp(-Math.PI / 4, Math.PI / 4, rad)
  })

  useMotionValueEvent(clampedRotationAngle, 'change', rad => {
    gravityVolume.setGravity(rad > 0 ? 0.5 : -0.5)
  })

  const barRef = useRef<HTMLDivElement & { centerX: number; centerY: number }>(
    null
  )

  return (
    <motion.div
      className={props.className}
      ref={barRef}
      style={{ rotateZ: useMotionTemplate`${clampedRotationAngle}rad` }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={() => {
        if (!barRef.current) return
        const box = barRef.current.getBoundingClientRect()
        const centerX = (box.left + box.right) / 2
        const centerY = (box.top + box.bottom) / 2

        barRef.current.centerX = centerX
        barRef.current.centerY = centerY
      }}
      onDrag={(_e, info) => {
        if (!barRef.current) return

        const angle = Math.atan(
          (info.point.y - barRef.current.centerY) /
            (info.point.x - barRef.current.centerX)
        )

        rotationAngle.set(angle)
      }}
    >
      {props.children}
    </motion.div>
  )
}
