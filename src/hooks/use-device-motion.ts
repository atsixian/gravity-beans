import { useCallback } from 'react'

// for iOS 13+
export type MotionPermissionStatus =
  | 'granted'
  | 'denied'
  | 'unknown'
  | 'nodevice'

export interface DeviceMotionEventiOS extends DeviceMotionEvent {
  requestPermission?: () => Promise<MotionPermissionStatus>
}

export type UseDeviceMotionParams = {
  onChange: (event: DeviceMotionEvent) => void
}

export type UseDeviceMotion = {
  requestPermission(): Promise<MotionPermissionStatus>
  startUpdatingDeviceMotion(): void
  stopUpdatingDeviceMotion(): void
}

export function useDeviceMotion({
  onChange,
}: UseDeviceMotionParams): UseDeviceMotion {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChangeCb = useCallback(onChange, [])

  const requestPermission = async () => {
    let status: MotionPermissionStatus = 'granted'

    const request = (DeviceMotionEvent as unknown as DeviceMotionEventiOS)
      .requestPermission

    if (typeof request === 'function') {
      status = await request()
    }

    return status
  }

  const startUpdatingDeviceMotion = () => {
    window.addEventListener('devicemotion', onChangeCb)
  }

  const stopUpdatingDeviceMotion = () => {
    window.removeEventListener('devicemotion', onChangeCb)
  }

  return {
    requestPermission,
    startUpdatingDeviceMotion,
    stopUpdatingDeviceMotion,
  }
}
