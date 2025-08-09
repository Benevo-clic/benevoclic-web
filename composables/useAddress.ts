// composables/useAddress.ts
import { ref } from 'vue'
import type { Ref } from 'vue'

interface Feature {
  properties: {
    id: number;
    label: string;
    postcode: string;
    city: string;
    context: string;
    lat: number;
    lon: number;
  };
}

export function useAddressAutocomplete (): {
  query: Ref<string>;
  suggestions: Ref<Feature[]>;
  search: () => Promise<void>;
  pick: (feat: Feature) => void;
  } {
  const query = ref('')
  const suggestions = ref<Feature[]>([])

  async function search () {
    if (query.value.length < 3) {
      suggestions.value = []
      return
    }
    const url = new URL('https://api-adresse.data.gouv.fr/search/')
    url.searchParams.set('q', query.value)
    url.searchParams.set('limit', '5')
    const res = await fetch(url.toString())
    const json = await res.json()
    suggestions.value = json.features
  }

  function pick (feat: Feature) {
    query.value = feat.properties.label
    suggestions.value = []
  }

  return { query, suggestions, search, pick }
}
