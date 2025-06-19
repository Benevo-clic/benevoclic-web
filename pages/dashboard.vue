<template>
  <div class="p-8">
    <div class="max-w-4xl mx-auto">
    </div>
  </div>
</template>

<script setup lang="ts">
import {definePageMeta} from "#imports";


definePageMeta({
  middleware: ['auth'],
  layout:'header'
})

</script>