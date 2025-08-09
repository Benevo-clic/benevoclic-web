<script setup lang="ts">
import { KeyRound, LogIn } from 'lucide-vue-next'

const { t } = useI18n()

const myModal3 = ref<HTMLDialogElement | null>(null)
const isRegister = ref(false)

function handleLogin () {
  myModal3.value?.showModal()
  isRegister.value = false
}
function handleRegister () {
  myModal3.value?.showModal()
  isRegister.value = true
}
</script>

<template>
  <button class="btn btn-primary px-2 py-0" @click.prevent="handleLogin">
    <KeyRound class="text-secondary-content" />
    <span class="text-secondary-content">{{ t("auth.register.login") }}</span>
  </button>

  <dialog ref="myModal3" class="modal">
    <div class="modal-box w-11/12 max-w-7xl" @click.stop>
      <form method="dialog">
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          @click="myModal3?.close()"
        >
          ✕
        </button>
      </form>
      <HeaderAuthLogin :is-register-local="isRegister" />
    </div>
  </dialog>
  <button
    class="btn btn-neutral-content px-2 py-0"
    @click.prevent="handleRegister"
  >
    <LogIn class="icon" />
    {{ t("auth.register.title") }}
  </button>

  <dialog ref="myModal3" class="modal">
    <div class="modal-box w-11/12 max-w-7xl" @click.stop>
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        @click="myModal3?.close()"
      >
        ✕
      </button>
      <HeaderAuthLogin :is-register-local="isRegister" />
    </div>
  </dialog>
</template>

<style scoped></style>
