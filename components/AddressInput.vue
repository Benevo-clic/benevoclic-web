<!-- components/AddressInput.vue -->
<template>
  <div>
    <input
        v-model="query"
        @input="onInput"
        placeholder="Rechercher une adresse…"
        class="border p-2 rounded w-full"
    />
    <ul v-if="suggestions.length" class="bg-white border rounded mt-1">
      <li
          v-for="s in suggestions"
          :key="s.properties.id"
          @click="() => select(s)"
          class="px-2 py-1 hover:bg-gray-100 cursor-pointer"
      >
        {{ s.properties.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useAddressAutocomplete } from '~/composables/useAddress'
import { debounce } from 'lodash'

const { query, suggestions, search, pick } = useAddressAutocomplete()

const onInput = debounce(() => {
  search()
}, 300)

function select(feat: any) {
  pick(feat)
  // émettre un évènement pour le parent
  emit('selected', {
    lat: feat.properties.lat,
    lon: feat.properties.lon,
    label: feat.properties.label
  })
}
</script>
