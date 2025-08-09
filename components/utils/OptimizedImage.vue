<!--
  Composant OptimizedImage - Image optimisée avec accessibilité

  Utilisation:
  <OptimizedImage
    src="/path/to/image.jpg"
    alt="Description de l'image"
    :width="400"
    :height="300"
    loading="lazy"
    decoding="async"
    aspect-ratio="16/9"
    clickable
    @load="onImageLoad"
    @error="onImageError"
    @click="onImageClick"
  />

  Props:
  - src: URL de l'image
  - alt: Texte alternatif (obligatoire)
  - width/height: Dimensions de l'image
  - loading: 'lazy' | 'eager' (défaut: 'lazy')
  - decoding: 'sync' | 'async' | 'auto' (défaut: 'async')
  - aspectRatio: Ratio d'aspect (ex: '16/9')
  - containerClass: Classes CSS pour le conteneur
  - imageClass: Classes CSS pour l'image
  - placeholderClass: Classes CSS pour le placeholder
  - placeholderAriaLabel: Label ARIA pour le placeholder
  - sizes: Attribut sizes pour les images responsives
  - srcset: Attribut srcset pour les images responsives
  - clickable: Rendre l'image cliquable

  Announcements:
  - load: Émis quand l'image est chargée
  - error: Émis en cas d'erreur de chargement
  - click: Émis quand l'image est cliquée (si clickable=true)
-->
<template>
  <div class="image-container" :class="containerClass" :style="containerStyle">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      :class="imageClass"
      :width="width"
      :height="height"
      :loading="loading"
      :decoding="decoding"
      :sizes="sizes"
      :srcset="srcset"
      @load="onImageLoad"
      @error="onImageError"
      @click="onImageClick"
    />
    <div v-else class="placeholder" :class="placeholderClass" :aria-label="placeholderAriaLabel">
      <slot name="placeholder">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    src?: string
    alt: string
    width?: number
    height?: number
    loading?: 'lazy' | 'eager'
    decoding?: 'sync' | 'async' | 'auto'
    aspectRatio?: string
    containerClass?: string
    imageClass?: string
    placeholderClass?: string
    placeholderAriaLabel?: string
    sizes?: string
    srcset?: string
    clickable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: 'lazy',
    decoding: 'async',
    containerClass: '',
    imageClass: '',
    placeholderClass: 'bg-base-300 text-base-content/60',
    placeholderAriaLabel: 'Image non disponible',
    clickable: false
  })

  const emit = defineEmits<{
    load: [event: Event]
    error: [event: Event]
    click: [event: MouseEvent]
  }>()

  const containerStyle = computed(() => {
    const styles: Record<string, string> = {}

    if (props.aspectRatio) {
      styles.aspectRatio = props.aspectRatio
    }

    if (props.clickable) {
      styles.cursor = 'pointer'
    }

    return styles
  })

  function onImageLoad(event: Event) {
    emit('load', event)
  }

  function onImageError(event: Event) {
    emit('error', event)
  }

  function onImageClick(event: MouseEvent) {
    if (props.clickable) {
      emit('click', event)
    }
  }
</script>

<style scoped>
  .image-container {
    position: relative;
    overflow: hidden;
  }

  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .image-container img:hover {
    transform: scale(1.05);
  }

  .placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  /* Amélioration de l'accessibilité */
  .image-container:focus-visible {
    outline: 2px solid #eb5577;
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Respect des préférences de réduction de mouvement */
  @media (prefers-reduced-motion: reduce) {
    .image-container img {
      transition: none;
    }

    .image-container img:hover {
      transform: none;
    }
  }
</style>
