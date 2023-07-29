import { Howl, HowlOptions } from 'howler'
import { useEffect, useRef } from 'react'

type Howls<T extends Record<string, HowlOptions>> = Record<keyof T, Howl>

export function useSound<T extends Record<string, HowlOptions>>(sounds: T) {
  type SoundName = keyof T

  const currentSound = useRef<Howl | null>(null)
  const howls = useRef<Howls<T>>({} as Howls<T>)

  useEffect(() => {
    Object.entries(sounds).forEach(
      ([soundName, options]: [SoundName, HowlOptions]) => {
        howls.current[soundName] = new Howl(options)
      }
    )
  }, [sounds])

  const play = (soundName?: SoundName) => {
    if (!soundName) {
      currentSound.current?.play()
      return
    }

    if (
      currentSound.current === howls.current[soundName] &&
      currentSound.current.playing()
    )
      return

    currentSound.current?.pause()
    howls.current[soundName].play()
    currentSound.current = howls.current[soundName]
  }

  const pause = (soundName?: SoundName) => {
    if (!soundName) {
      currentSound.current?.pause()
      return
    }

    howls.current[soundName].pause()
  }

  const get = (soundName: SoundName) => {
    return howls.current[soundName]
  }

  const volume = (vol: number) => {
    currentSound.current?.volume(vol)
  }

  const getCurrentSound = () => {
    return currentSound.current
  }

  const isPlaying = (soundName?: SoundName) => {
    if (!soundName) {
      if (!currentSound.current) return false

      return currentSound.current?.playing()
    }

    return currentSound.current === howls.current[soundName]
  }

  return { play, pause, get, getCurrentSound, volume, isPlaying }
}
