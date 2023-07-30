import { Howl, HowlOptions } from 'howler'
import { useEffect, useRef, useState } from 'react'

type Howls<T extends Record<string, HowlOptions>> = Record<keyof T, Howl>

/**
 * Multiple sound sources, but only plays one sound at a time,
 * like switching songs in your music player
 */
export function useSoundSwitcher<T extends Record<string, HowlOptions>>(
  sounds: T
) {
  type SoundName = keyof T

  const currentSound = useRef<Howl | null>(null)
  const howls = useRef<Howls<T>>({} as Howls<T>)
  const [isPlaying, setIsPlaying] = useState(false)

  const [isLoaded, setIsLoaded] = useState(false)

  const loadedCount = useRef(0)

  useEffect(() => {
    const soundArray = Object.entries(sounds)

    soundArray.forEach(([soundName, options]: [SoundName, HowlOptions]) => {
      howls.current[soundName] = new Howl({
        ...options,
        onload: () => {
          loadedCount.current += 1
          if (loadedCount.current === soundArray.length) {
            setIsLoaded(true)
          }
        },
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const play = (soundName?: SoundName) => {
    if (!soundName) {
      currentSound.current?.play()
      setIsPlaying(true)
      return
    }

    if (
      currentSound.current === howls.current[soundName] &&
      currentSound.current.playing()
    ) {
      return
    }

    currentSound.current?.stop()
    howls.current[soundName].play()
    currentSound.current = howls.current[soundName]
    setIsPlaying(true)
  }

  const pause = () => {
    currentSound.current?.pause()
    setIsPlaying(false)
  }

  const stop = () => {
    currentSound.current?.stop()
  }

  const get = (soundName: SoundName) => {
    return howls.current[soundName]
  }

  const volume = (vol: number) => {
    currentSound.current?.volume(vol)
  }

  const current = () => {
    return currentSound.current
  }

  return { play, pause, stop, get, current, volume, isPlaying, isLoaded }
}
