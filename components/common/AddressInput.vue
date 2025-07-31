<script setup lang="ts">


import {ref} from "vue";

interface AddressFeature {
  properties: {
    id: string
    label: string
    name: string
    postcode: string
    city: string
    context: string
  }
  geometry: {
    coordinates: [number, number]
  }
}

const props = defineProps<{
  initialAddress?: string
}>()

const emit = defineEmits(['addressSelected'])

const selectAddress = (address: AddressFeature) => {

  const fullLabel = address.properties.label;

  const regex = /^(.*?)\s+((?:0[1-9]|[1-8]\d|9[0-8])\d{3})\s+(.*)$/;
  const match = fullLabel.match(regex);
  if (match) {
    const street   = match[1];
    const zipCode  = match[2];
    const city     = match[3];
    query.value = street;

    selectedAddress.value = address.properties.label
    emit('addressSelected', {
      properties:{
        address: street,
        city: city,
        postcode: zipCode,
      },
      geometry: {
        coordinates: address.geometry.coordinates
      }
    })
    showSuggestions.value = false
    query.value = street
  }

}

interface AddressResponse {
  features: AddressFeature[]
}

const query = ref('')
const suggestions = ref<AddressFeature[]>([])
const showSuggestions = ref(false)
const selectedAddress = ref<string>('')

let searchTimeout: NodeJS.Timeout

if (props.initialAddress) {
  query.value = props.initialAddress
}


const searchAddresses = async () => {
  if (!query.value || query.value.length < 3) {
    suggestions.value = []
    return
  }

  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    try {
      const response = await fetch(
          `https://api-adresse.data.gouv.fr/search?q=${encodeURIComponent(query.value)}&limit=5`
      )
      const data: AddressResponse = await response.json()
      suggestions.value = data.features
    } catch (error) {
      console.error('Erreur lors de la recherche d\'adresses:', error)
      suggestions.value = []
    }
  }, 300)
}

</script>

<template>
  <div class="form-control w-full search-container">
    <label class="label">
      <span class="label-text">Lieu (Adresse) <span class="text-error">*</span></span>
    </label>
    <input
        v-model="query"
        @input="searchAddresses"
        @focus="showSuggestions = true"
        placeholder="Rechercher une adresse..."
        class="search-input"
        type="text"
    aria-label="Champ de saisie">

    <!-- Suggestions d'adresses -->
    <div v-if="showSuggestions && suggestions.length > 0" class="suggestions-container">
      <div
          v-for="suggestion in suggestions"
          :key="suggestion.properties.id"
          @click="selectAddress(suggestion)"
          class="suggestion-item"
      >
        <div class="suggestion-text">
          {{ suggestion.properties.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.address-map-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-container {
  position: relative;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.suggestions-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 0.375rem 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background-color: #f9fafb;
}

.suggestion-text {
  font-size: 0.875rem;
  color: #374151;
}

.map-container {
  width: 100%;
  height: 400px;
  border-radius: 0.375rem;
  overflow: hidden;
  position: relative;
}
</style>