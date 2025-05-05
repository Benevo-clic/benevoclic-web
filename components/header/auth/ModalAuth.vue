<script setup lang="ts">
import {KeyRound,LogIn} from "lucide-vue-next";

const my_modal_3 = ref<HTMLDialogElement | null>(null)

function handleLogin() {
  my_modal_3.value?.showModal()
}

</script>

<template>
  <button class="btn btn-secondary" @click.prevent="handleLogin">
    <KeyRound class="text-neutral" />
    <span class="text-neutral">Se connecter</span>
  </button>

  <dialog ref="my_modal_3" class="modal">
    <div class="modal-box w-11/12 max-w-7xl" @click.stop>
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="my_modal_3?.close()">✕</button>
      </form>
      <HeaderAuthLogin />
    </div>
  </dialog>
  <button class="btn btn-primary" @click.prevent="handleLogin">
    <LogIn class="icon" />
    S'inscrire
  </button>

  <dialog ref="my_modal_3" class="modal">
    <div class="modal-box w-11/12 max-w-7xl " @click.stop>
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="my_modal_3?.close()">✕</button>
      <HeaderAuthLogin />
    </div>
  </dialog>
</template>

<style scoped>

</style>