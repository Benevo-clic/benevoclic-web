<template>
  <div class="card card-bordered bg-base-100 shadow flex flex-col md:flex-row items-center gap-4 p-4">
    <div class="avatar">
      <div class="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
        <img :src="volunteer.avatar" alt="avatar" />
      </div>
    </div>
    <div class="flex-1 min-w-0">
      <div class="font-bold text-lg">{{ volunteer.name }}</div>
      <div class="text-sm text-gray-500 break-all">{{ volunteer.email }}</div>
      <div v-if="type === 'event' && context" class="mt-1 text-sm text-primary">Pour l'événement : <span class="font-semibold">{{ context }}</span></div>
    </div>
    <div class="flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
      <button class="btn btn-success btn-sm" @click="$emit('accept')">Accepter</button>
      <button class="btn btn-error btn-sm" @click="$emit('refuse')">Refuser</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  volunteer: { name: string; email: string; avatar: string };
  context?: string;
  type: 'event' | 'association';
}>();
</script> 