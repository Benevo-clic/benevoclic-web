<template>
  <div>
    <!-- Les données structurées sont injectées via useSchemaOrg -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props pour les données structurées
interface Props {
  type?:
    | 'organization'
    | 'website'
    | 'webpage'
    | 'breadcrumb'
    | 'event'
    | 'person';
  data?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'website',
  data: () => ({})
})

// Configuration des données structurées selon le type
const structuredData = computed(() => {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': props.type.charAt(0).toUpperCase() + props.type.slice(1),
    ...props.data
  }

  switch (props.type) {
    case 'organization':
      return {
        ...baseData,
        '@type': 'Organization',
        name: props.data.name || 'Benevoclic',
        url: props.data.url || 'https://www.benevoclic.fr',
        logo:
          props.data.logo || 'https://www.benevoclic.fr/logo_benevoclic.png',
        description:
          props.data.description ||
          'Plateforme de bénévolat connectant associations et volontaires',
        sameAs: [
          'https://www.facebook.com/benevoclic',
          'https://twitter.com/benevoclic',
          'https://www.linkedin.com/company/benevoclic'
        ]
      }

    case 'website':
      return {
        ...baseData,
        '@type': 'WebSite',
        name: props.data.name || 'Benevoclic',
        url: props.data.url || 'https://www.benevoclic.fr',
        description: props.data.description || 'Plateforme de bénévolat',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.benevoclic.fr/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }

    case 'webpage':
      return {
        ...baseData,
        '@type': 'WebPage',
        name: props.data.name || 'Page Benevoclic',
        url: props.data.url || 'https://www.benevoclic.fr',
        description:
          props.data.description || 'Page de la plateforme Benevoclic',
        breadcrumb: props.data.breadcrumb || {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Accueil',
              item: 'https://www.benevoclic.fr'
            }
          ]
        }
      }

    case 'breadcrumb':
      return {
        ...baseData,
        '@type': 'BreadcrumbList',
        itemListElement: props.data.itemListElement || [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Accueil',
            item: 'https://www.benevoclic.fr'
          }
        ]
      }

    case 'event':
      return {
        ...baseData,
        '@type': 'Event',
        name: props.data.name || 'Événement de bénévolat',
        description: props.data.description || 'Événement de bénévolat',
        startDate: props.data.startDate,
        endDate: props.data.endDate,
        location: props.data.location || {
          '@type': 'Place',
          name: "Lieu de l'événement",
          address: {
            '@type': 'PostalAddress',
            streetAddress: props.data.address?.street || '',
            addressLocality: props.data.address?.city || '',
            postalCode: props.data.address?.postalCode || '',
            addressCountry: props.data.address?.country || 'FR'
          }
        },
        organizer: props.data.organizer || {
          '@type': 'Organization',
          name: 'Association organisatrice'
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock'
        }
      }

    case 'person':
      return {
        ...baseData,
        '@type': 'Person',
        name: props.data.name || 'Utilisateur',
        email: props.data.email,
        image: props.data.image,
        jobTitle: props.data.jobTitle || 'Bénévole',
        worksFor: props.data.worksFor || {
          '@type': 'Organization',
          name: 'Benevoclic'
        }
      }

    default:
      return baseData
  }
})

// Injection des données structurées
useSchemaOrg([structuredData.value])
</script>
