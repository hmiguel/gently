import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

// Haptics are feedback, never essential: swallow failures (e.g. in the browser).
export const tap = () => Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
export const thud = () => Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {})
export const buzzError = () => Haptics.notification({ type: NotificationType.Error }).catch(() => {})
