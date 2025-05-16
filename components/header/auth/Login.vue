<script setup lang="ts">
import { ref } from 'vue'
import {  watch } from 'vue'

const { t } = useI18n()
const isAssociation = ref(false)
const props = defineProps<{ isRegisterLocal: boolean }>()
const isRegister = ref(props.isRegisterLocal)

watch(
    () => props.isRegisterLocal,
    (newVal) => {
      isRegister.value = newVal
    },
    { immediate: true }
)

function toggleCheck() {
  isAssociation.value = !isAssociation.value
}

definePageMeta({
  middleware: ['guest'],
})

function handleCheckboxChange(value: boolean) {
  isAssociation.value = value
}

function handleRegisterChange(value: boolean) {
  isRegister.value = value
}


</script>


<template>
  <div class="min-h-[85vh] flex flex-col md:flex-row items-center justify-center gap-8 px-4">

    <HeaderAuthFormLoginForm
        @toggle-check="handleCheckboxChange"
        :checked="isAssociation"
        @toggle-register="handleRegisterChange"
        :is-register="isRegister"
    />

    <div class="hidden md:flex flex-col justify-center items-center w-1/2">
      <img
          src="/images/login-user.png"
          alt="Illustration"
          class="w-full max-w-xl mx-auto"
          v-if="!isRegister"
      />
      <img
          src="/images/illustration-login-association.png"
          alt="Illustration"
          class="w-full max-w-xl mx-auto"
          v-if="!isAssociation && isRegister"
      />
      <img
          src="/images/illustration-login-volunteer.png"
          alt="Illustration"
          class="w-full max-w-xl mx-auto"
          v-if="isAssociation && isRegister"
      />
      <h1 class="text-xl sm:text-2xl font-bold mb-2" v-if="isRegister">
        {{ t(isAssociation ? 'auth.register.association_true' : 'auth.register.association_false') }}
      </h1>
      <button
          @click="toggleCheck"
          class="text-base sm:text-lg text-primary hover:underline mt-1"
          v-if="isAssociation && isRegister"
      >
        {{t('auth.register.association_register')}}
      </button>
      <button
          @click="toggleCheck"
          class="text-base sm:text-lg font-bold  mt-1"
          v-if="!isAssociation && isRegister"
      >
        {{t('auth.register.click_here')}} <span class="text-primary hover:underline"> {{t('auth.register.info_click_here')}}
      </span>
      </button>

    </div>
  </div>
</template>