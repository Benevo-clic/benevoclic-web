<script setup lang="ts">
  import { ref, computed } from 'vue'
  const { t } = useI18n()

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

  const query = ref('')
  const suggestions = ref<AddressFeature[]>([])
  const showSuggestions = ref(false)
  const selectedAddress = ref<string>('')
  const isLoading = ref(false)
  const activeIndex = ref(-1)

  let searchTimeout: NodeJS.Timeout

  if (props.initialAddress) {
    query.value = props.initialAddress
  }

  const activeSuggestionId = computed(() => {
    if (activeIndex.value >= 0 && suggestions.value[activeIndex.value]) {
      return `suggestion-${suggestions.value[activeIndex.value].properties.id}`
    }
    return undefined
  })

  const selectAddress = (address: AddressFeature) => {
    const fullLabel = address.properties.label

    const regex = /^(.*?)\s+((?:0[1-9]|[1-8]\d|9[0-8])\d{3})\s+(.*)$/
    const match = fullLabel.match(regex)
    if (match) {
      const street = match[1]
      const zipCode = match[2]
      const city = match[3]
      query.value = street

      selectedAddress.value = address.properties.label
      emit('addressSelected', {
        properties: {
          address: street,
          city,
          postcode: zipCode
        },
        geometry: {
          coordinates: address.geometry.coordinates
        }
      })
      showSuggestions.value = false
      activeIndex.value = -1
      query.value = street
    }
  }

  interface AddressResponse {
    features: AddressFeature[]
  }

  const searchAddresses = () => {
    if (!query.value || query.value.length < 3) {
      suggestions.value = []
      showSuggestions.value = false
      activeIndex.value = -1
      return
    }

    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(async () => {
      try {
        isLoading.value = true
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search?q=${encodeURIComponent(query.value)}&limit=5`
        )
        const data: AddressResponse = await response.json()
        suggestions.value = data.features
        showSuggestions.value = true
        activeIndex.value = -1
      } catch (error) {
        suggestions.value = []
      } finally {
        isLoading.value = false
      }
    }, 300)
  }

  const handleBlur = () => {
    // Délai pour permettre le clic sur les suggestions
    setTimeout(() => {
      showSuggestions.value = false
      activeIndex.value = -1
    }, 200)
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (!showSuggestions.value || suggestions.value.length === 0) {
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        activeIndex.value = Math.min(activeIndex.value + 1, suggestions.value.length - 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        activeIndex.value = Math.max(activeIndex.value - 1, -1)
        break
      case 'Escape':
        showSuggestions.value = false
        activeIndex.value = -1
        break
      case 'Enter':
        if (activeIndex.value >= 0) {
          event.preventDefault()
          selectAddress(suggestions.value[activeIndex.value])
        }
        break
    }
  }
</script>

<template>
  <div class="form-control w-full search-container">
    <label for="address-input" class="label">
      <span class="label-text"
        >Lieu (Adresse) <span class="text-error" aria-label="Champ obligatoire">*</span></span
      >
    </label>
    <div class="relative">
      <input
        id="address-input"
        v-model="query"
        :placeholder="t('common.placeholder_address_search')"
        class="search-input focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
        type="text"
        :autocomplete="t('common.auto_complete_address')"
        :aria-label="t('common.aria_label_search')"
        :aria-expanded="showSuggestions && suggestions.length > 0"
        :aria-activedescendant="activeSuggestionId"
        role="combobox"
        aria-haspopup="listbox"
        :aria-describedby="t('common.address_description')"
        @input="searchAddresses"
        @focus="showSuggestions = true"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />

      <!-- Indicateur de chargement -->
      <div
        v-if="isLoading"
        class="absolute right-3 top-1/2 transform -translate-y-1/2"
        aria-hidden="true"
      >
        <div class="loading loading-spinner loading-sm" />
      </div>
    </div>

    <!-- Description pour l'accessibilité -->
    <div id="address-description" class="text-sm text-base-content opacity-70 mt-1">
      {{ t('common.address_description') }}
      Tapez au moins 3 caractères pour voir les suggestions d'adresses
    </div>

    <!-- Suggestions d'adresses -->
    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="suggestions-container"
      role="listbox"
      :aria-label="t('common.aria_label_suggestions')"
    >
      <div
        v-for="(suggestion, index) in suggestions"
        :id="`suggestion-${suggestion.properties.id}`"
        :key="suggestion.properties.id"
        :class="['suggestion-item', { active: index === activeIndex }]"
        role="option"
        :aria-selected="index === activeIndex"
        tabindex="0"
        @click="selectAddress(suggestion)"
        @keyup.enter="selectAddress(suggestion)"
        @keyup.space.prevent="selectAddress(suggestion)"
      >
        <div class="suggestion-text">
          {{ suggestion.properties.label }}
        </div>
      </div>
    </div>

    <!-- Message d'état pour les lecteurs d'écran -->
    <div
      v-if="showSuggestions && suggestions.length === 0 && query.length >= 3"
      class="sr-only"
      aria-live="polite"
    >
      {{ t('common.no_suggestions_found') }}
    </div>
  </div>
</template>

<style scoped>
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

  .suggestion-item:hover,
  .suggestion-item.active {
    background-color: #f9fafb;
  }

  .suggestion-item:focus {
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
  }

  .suggestion-text {
    font-size: 0.875rem;
    color: #374151;
  }

  /* Amélioration pour l'accessibilité */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
