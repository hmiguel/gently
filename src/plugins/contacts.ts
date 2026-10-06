import { registerPlugin, WebPlugin } from '@capacitor/core'

/**
 * System contact picker for one phone number. Android implements it in
 * android/app/src/main/java/com/lixo/gently/callguard/ContactPickerPlugin.java.
 */
export interface PickedContact {
  number: string
  name?: string
}

export interface ContactPickerPlugin {
  /** Resolves with `contact: null` when the user backs out. */
  pickPhone(): Promise<{ contact: PickedContact | null }>
}

/** Browser stand-in for `npm run dev`. */
class ContactPickerWeb extends WebPlugin implements ContactPickerPlugin {
  async pickPhone() {
    return { contact: { number: '+351 912 000 111', name: 'Sample Contact' } }
  }
}

export const ContactPicker = registerPlugin<ContactPickerPlugin>('ContactPicker', {
  web: () => new ContactPickerWeb(),
})
