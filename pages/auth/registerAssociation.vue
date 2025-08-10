<script setup lang="ts">
  import RegisterAssociation from '~/components/register/association/RegisterAssociation.vue'
  import { definePageMeta } from '#imports'

  definePageMeta({
    middleware: ['auth'],
    layout: 'header-auth'
  })
</script>

<template>
  <RegisterAssociation />
</template>

<style scoped></style>
