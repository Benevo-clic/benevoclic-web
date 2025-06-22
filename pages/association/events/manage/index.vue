<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-base-100 rounded-lg shadow-md p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-base-content">Liste des annonces</h1>
      </div>

      <ReadOnlyEventList
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from "#imports";

import ReadOnlyEventList from '~/components/event/ReadOnlyEventList.vue';

definePageMeta({
  middleware: ['auth'],
  layout: 'header'
})

</script>
