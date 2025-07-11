<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {useAuthStore} from "~/stores/auth/auth.store";
import {useUser} from "~/composables/auth/useUser";
import {RoleUser} from "~/common/enums/role.enum";

// Durée initiale du compte à rebours en secondes (ex. 300s = 5 minutes)
const initialSeconds = 300

const authStore = useAuthStore()
const { t } = useI18n()
const useAuth = useUser()

// 🔧 Récupérer les données depuis le store
const password = computed(() => authStore.tempPassword)
const role = computed(() => authStore.role)


const remaining = ref<number>(initialSeconds)
let timerId: ReturnType<typeof setInterval> | null = null
const isFinished = computed(() => remaining.value <= 0)

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function startTimer() {
  if (timerId) return
  timerId = setInterval(() => {
    if (remaining.value > 0) {
      remaining.value--
    } else {
      clearInterval(timerId!)
      timerId = null
    }
  }, 1000)
}

async function resendEmail() {
  await useAuth.sendEmailVerification({
    tempPassword: password.value as string,
    role: role.value as RoleUser
  })
  remaining.value = initialSeconds
  startTimer()
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center p-6 space-y-4">
    <p class="text-center text-lg">
      {{ t('auth.verification.sent') }}
    </p>
    <p class="text-center text-2xl font-mono">
      {{ formatTime(remaining) }}
    </p>
    <button
        @click="resendEmail"
        :disabled="isFinished"
        class="btn btn-link"
    >
      <span v-if="isFinished" class="opacity-50 cursor-not-allowed">
        {{ t('auth.verification.wait') }}
      </span>
      <span v-else>
        {{ t('auth.verification.resend') }}
      </span>
    </button>
  </div>
</template>

