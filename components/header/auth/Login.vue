<script setup lang="ts">
import { ref, watch } from 'vue'

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

function toggleCheck () {
  isAssociation.value = !isAssociation.value
}

function handleCheckboxChange (value: boolean) {
  isAssociation.value = value
}

function handleRegisterChange (value: boolean) {
  isRegister.value = value
}
</script>

<template>
  <div
    class="min-h-[85vh] flex flex-col md:flex-row items-center justify-center gap-8 px-4"
  >
    <HeaderAuthFormLoginForm
      :checked="isAssociation"
      :is-register="isRegister"
      @toggle-check="handleCheckboxChange"
      @toggle-register="handleRegisterChange"
    />

    <div class="hidden md:flex flex-col justify-center items-center w-1/2">
      <img
        v-if="!isRegister"
        src="/images/login-user.png"
        alt="Illustration"
        class="w-full max-w-xl mx-auto"
      >
      <img
        v-if="!isAssociation && isRegister"
        src="/images/illustration-login-association.png"
        alt="Illustration"
        class="w-full max-w-xl mx-auto"
      >
      <img
        v-if="isAssociation && isRegister"
        src="/images/illustration-login-volunteer.png"
        alt="Illustration"
        class="w-full max-w-xl mx-auto"
      >
      <h1 v-if="isRegister" class="text-xl sm:text-2xl font-bold mb-2">
        {{
          t(
            isAssociation
              ? "auth.register.association_true"
              : "auth.register.association_false",
          )
        }}
      </h1>
      <button
        v-if="isAssociation && isRegister"
        class="text-base sm:text-lg text-primary hover:underline mt-1"
        @click="toggleCheck"
      >
        {{ t("auth.register.association_register") }}
      </button>
      <button
        v-if="!isAssociation && isRegister"
        class="text-base sm:text-lg font-bold mt-1"
        @click="toggleCheck"
      >
        {{ t("auth.register.click_here") }}
        <span class="text-primary hover:underline">
          {{ t("auth.register.info_click_here") }}
        </span>
      </button>
    </div>
  </div>
</template>
