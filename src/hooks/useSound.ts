import { Howl, HowlOptions } from 'howler'
import { useEffect, useRef } from 'react'

type Howls<T extends Record<string, HowlOptions>> = Record<keyof T, Howl>

/**
 * Multiple sound sources, but only plays one sound at a time,
 * like switching songs in your music player
 */
export function useSoundSwitcher<T extends Record<string, HowlOptions>>(sounds: T) {
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

    currentSound.current?.stop()
    howls.current[soundName].play()
    currentSound.current = howls.current[soundName]
  }

  /**
   * Pauses the current sound.
   */
  const pause = () => {
    currentSound.current?.pause()
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

  const isPlaying = () => {
    if (!currentSound.current) return false

    return currentSound.current?.playing()
  }

  return { play, pause, get, current, volume, isPlaying }
}
