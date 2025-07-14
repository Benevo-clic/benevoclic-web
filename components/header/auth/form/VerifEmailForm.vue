<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from "~/stores/auth/auth.store"
import { useUser } from "~/composables/auth/useUser"
import { getAuth } from 'firebase/auth'
import type {RoleUser} from "~/common/enums/role.enum";

const { t } = useI18n()
const useAuth = useUser()
const authStore = useAuthStore()

// AJOUT : États pour la vérification manuelle
const isEmailVerified = ref(false)
const isChecking = ref(false)
const error = ref('')

//  AJOUT : États pour le minuteur
const countdown = ref(60) // 60 secondes = 1 minute
const canResend = ref(false)
let timerId: ReturnType<typeof setInterval> | null = null
const tempPwdCookie = useCookie<string>('tempPassword')
const roleCookie   = useCookie<string>('userRole')
const emailCookie  = useCookie<string>('email')

// // CORRECTION : Récupérer les bonnes données
// const email = computed(() => authStore.email)
// const password = computed(() => authStore.tempPassword)
// const role = computed(() => authStore.role)
const isVerified = computed(() => authStore.isVerified)

// 🔧 AJOUT : Watcher sur isVerified
watch(isVerified, (newValue, oldValue) => {
  console.log(' Watcher isVerified:', { oldValue, newValue })
  
  if (newValue === true && oldValue === false) {
    console.log('✅ Email vérifié détecté par le watcher!')
    isEmailVerified.value = true
    error.value = '' // Effacer les erreurs
    //  AJOUT : Arrêter le minuteur si l'email est vérifié
    stopTimer()
  }
}, { immediate: true })

// 🔧 AJOUT : Fonction pour démarrer le minuteur
function startTimer() {
  countdown.value = 60
  canResend.value = false
  
  timerId = setInterval(() => {
    countdown.value--
    
    if (countdown.value <= 0) {
      canResend.value = true
      stopTimer()
    }
  }, 1000)
}

// 🔧 AJOUT : Fonction pour arrêter le minuteur
function stopTimer() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

// 🔧 AJOUT : Fonction pour formater le temps
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

// 🔧 AJOUT : Fonction pour renvoyer l'email
async function resendEmail() {
  try {
    isChecking.value = true
    error.value = ''

    authStore.$patch({
      tempPassword: tempPwdCookie.value,
      role:         roleCookie.value as RoleUser,
      email:        emailCookie.value
    })
    await useAuth.sendEmailVerification({
      tempPassword: authStore.tempPassword as string,
      role: authStore.role as RoleUser
    })
    startTimer()
  } catch (err: any) {
    error.value = 'Erreur lors de l\'envoi: ' + err.message
  } finally {
    isChecking.value = false
  }
}

// 🔧 AJOUT : Fonction pour vérifier manuellement l'email
async function checkEmailVerification() {
  isChecking.value = true
  error.value = ''
  
  try {
    const auth = getAuth()
    const currentUser = auth.currentUser
    
    if (!currentUser) {
      error.value = 'Aucun utilisateur connecté'
      return
    }
    
    await currentUser.reload()

    if (currentUser.emailVerified) {
      // 🔧 AJOUT : Mettre à jour le store pour déclencher le watcher
      authStore.$patch({ isVerified: true })
      console.log('✅ Email vérifié avec succès!')
    } else {
      error.value = 'L\'email n\'est pas encore vérifié. Vérifiez votre boîte de réception.'
    }
  } catch (err: any) {
    error.value = 'Erreur lors de la vérification: ' + err.message
  } finally {
    isChecking.value = false
  }
}

// 🔧 CORRECTION : Fonction pour continuer l'inscription
async function continueRegistration() {
  try {

    authStore.$patch({
      tempPassword: tempPwdCookie.value,
      role:         roleCookie.value as RoleUser,
      email:        emailCookie.value
    })

    // 🔧 Appeler la fonction login du store auth
    await authStore.login({
      email: authStore.email,
      password: decodePasswordBase64(authStore.tempPassword),
      role: authStore.role as RoleUser,
    }).then(() => {
      tempPwdCookie.value = ''
      roleCookie.value = ''
      emailCookie.value = ''
    }).catch((err: any) => {
      error.value = 'Erreur lors de la connexion: ' + err.message
      console.error('❌ Erreur de connexion:', err)
    })
    
  } catch (err: any) {
    error.value = 'Erreur lors de la connexion: ' + err.message
    console.error('❌ Erreur de connexion:', err)
  }
}


// 🔧 AJOUT : Fonction pour retourner à la page de connexion
async function goBackToLogin() {
  await authStore.deleteCookies()
  navigateTo('/')
}

onMounted(() => {
  // Vérifier automatiquement au chargement
  checkEmailVerification()
  // 🔧 AJOUT : Démarrer le minuteur au chargement
  startTimer()
})

onUnmounted(() => {
  // 🔧 AJOUT : Nettoyer le minuteur
  stopTimer()
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-base-content">
          {{ t('auth.verification.title') }}
        </h2>
        <p class="mt-2 text-base-content opacity-70">
          {{ t('auth.verification.sent') }}
        </p>
      </div>

      <!-- AJOUT : Section de vérification manuelle -->
      <div class="bg-base-100 p-6 rounded-lg shadow-md">
        <div class="text-center space-y-4">
          <!-- Bouton pour vérifier l'email -->
          <button 
            @click="checkEmailVerification"
            :disabled="isChecking"
            class="btn btn-primary w-full"
          >
            <span v-if="isChecking" class="loading loading-spinner loading-sm"></span>
            <span v-else>{{ t('auth.verification.check_email') }}</span>
          </button>

          <!-- Message d'erreur -->
          <div v-if="error" class="alert alert-error">
            {{ error }}
          </div>

          <!-- 🔧 AJOUT : Bouton de renvoi d'email (visible seulement si pas vérifié) -->
          <div v-if="!isEmailVerified" class="space-y-3">
            <div class="text-center text-sm text-base-content opacity-70">
              <p>{{ t('auth.verification.no_email') }}</p>
            </div>
            
            <button 
              @click="resendEmail"
              :disabled="!canResend || isChecking"
              class="btn btn-outline w-full"
            >
              <span v-if="isChecking" class="loading loading-spinner loading-sm"></span>
              <span v-else-if="!canResend">
                {{ t('auth.verification.wait') }} ({{ formatTime(countdown) }})
              </span>
              <span v-else>
                {{ t('auth.verification.resend') }}
              </span>
            </button>
          </div>

          <!-- 🔧 AJOUT : Boutons après vérification -->
          <div v-if="isEmailVerified" class="space-y-3">
            <div class="alert alert-success">
              ✅ {{ t('auth.verification.email_verified') }}
            </div>
            
            <div class="flex space-x-3">
              <button 
                @click="continueRegistration"
                class="btn btn-primary flex-1"
              >
                {{ t('auth.verification.continue_registration') }}
              </button>
              
              <button 
                @click="goBackToLogin"
                class="btn btn-outline flex-1"
              >
                {{ t('auth.verification.back_to_login') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 🔧 AJOUT : Instructions -->
      <div class="text-center text-sm text-base-content opacity-70">
        <p>{{ t('auth.verification.instructions') }}</p>
        <p class="mt-2">{{ t('auth.verification.click_link') }}</p>
      </div>
    </div>
  </div>
</template>

