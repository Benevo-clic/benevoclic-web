<script setup lang="ts">
  import VerifEmailForm from '~/components/header/auth/form/VerifEmailForm.vue'
  import { definePageMeta } from '#imports'

  definePageMeta({
    layout: 'header-auth'
  })
</script>

<template>
  <VerifEmailForm />
</template>

<style scoped></style>
