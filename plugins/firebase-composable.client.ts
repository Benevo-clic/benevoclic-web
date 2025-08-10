import { useFirebase } from '~/composables/useFirebase'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(() => {
  if (process.client) {
    const firebase = useFirebase()
    const auth = useAuth()

    return {
      provide: {
        firebase,
        auth
      }
    }
  }
})
