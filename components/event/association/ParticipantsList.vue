<template>
  <div>
    <h3 class="text-lg font-bold mb-2">Participants</h3>
    <div v-if="props.participants && props.participants.length">
      <ul class="list-disc pl-4">
        <li v-for="p in props.participants" :key="p.id">{{ p.name }}</li>
      </ul>
    </div>
    <div v-else class="text-gray-400">Aucun participant pour cette annonce.</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ participants: { id: string, name: string }[] | undefined }>();
</script> 