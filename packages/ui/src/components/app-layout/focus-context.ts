import { inject, type InjectionKey, type Ref } from 'vue'

export interface FocusCommand { id: number; text: string }
export const focusModeKey: InjectionKey<Ref<boolean>> = Symbol('focus-mode')
export const focusBusyKey: InjectionKey<Ref<boolean>> = Symbol('focus-busy')
export const focusCommandKey: InjectionKey<Ref<FocusCommand | null>> = Symbol('focus-command')
export const useFocusMode = () => inject(focusModeKey, undefined)
