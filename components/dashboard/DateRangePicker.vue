<template>
  <div class="flex items-center gap-2">
    <input type="date" v-model="from" class="input input-sm border rounded" />
    <span>—</span>
    <input type="date" v-model="to" class="input input-sm border rounded" />
    <button class="btn btn-sm btn-primary ml-2" @click="emitRange">Filtrer</button>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ modelValue: { from: string, to: string } }>()
const emit = defineEmits(['update:modelValue', 'change'])
const from = ref(props.modelValue.from)
const to = ref(props.modelValue.to)
watch([from, to], () => emit('update:modelValue', { from: from.value, to: to.value }))
function emitRange() { emit('change', { from: from.value, to: to.value }) }
</script> 