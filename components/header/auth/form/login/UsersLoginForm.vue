<script setup lang="ts">

const {form,handleLogin,loading} = defineProps<{
  form: Record<string, any>,
  handleLogin: () => Promise<void>;
  loading: boolean;
}>()

</script>

<template>
  <form class="space-y-4" @submit.prevent="handleLogin">
    <div class="form-control">
      <label class="label">
        <span class="label-text">E-mail</span>
      </label>
      <input
          v-model="form.email"
          type="email"
          placeholder="email@example.com"
          class="input input-bordered w-full"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Mot de passe</span>
      </label>
      <input
          v-model="form.password"
          type="password"
          placeholder="Au moins 8 caractères"
          class="input input-bordered w-full"
      />
    </div>

    <button type="submit" class="btn btn-primary w-full" :disabled="loading">
      <span v-if="loading" class="loading loading-spinner loading-sm"></span>
      <span v-else>Se connecter</span>
    </button>

  </form>

</template>

<style scoped>

</style>