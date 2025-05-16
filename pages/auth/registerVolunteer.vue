<script setup lang="ts">
import RegisterVolunteer from "~/components/register/volunteer/RegisterVolunteer.vue";
import {definePageMeta} from "#imports";

definePageMeta({
  middleware: ['auth'],
  layout:'header-auth',
})

</script>

<template>

  <RegisterVolunteer />

</template>

<style scoped>

</style>