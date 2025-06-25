<template>
  <div>
    <h3 class="text-lg font-bold mb-2">Bénévoles</h3>
    <div v-if="volunteers && volunteers.length">
      <ul class="list-disc pl-4">
        <li v-for="v in volunteers" :key="v.id">{{ v.name }}</li>
      </ul>
    </div>
    <div v-else class="text-gray-400">Aucun bénévole pour cette annonce.</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ volunteers: { id: string, name: string }[] | undefined }>();
</script> 