import { ref, computed } from 'vue'

export function useImageOptimization() {
  const imageLoading = ref(false)
  const imageError = ref<string | null>(null)

  // Fonction pour optimiser une image base64
  const optimizeBase64Image = (base64: string, maxWidth = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Impossible de créer le contexte canvas'))
          return
        }

        // Calculer les nouvelles dimensions
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height)

        // Convertir en base64 avec compression
        const optimizedBase64 = canvas.toDataURL('image/jpeg', quality)
        resolve(optimizedBase64)
      }

      img.onerror = () => {
        reject(new Error("Erreur lors du chargement de l'image"))
      }

      img.src = base64
    })
  }

  // Fonction pour charger et optimiser une image depuis un fichier
  const loadAndOptimizeImage = async (
    file: File,
    maxWidth = 800,
    quality = 0.8
  ): Promise<string> => {
    imageLoading.value = true
    imageError.value = null

    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = async e => {
          try {
            const base64 = e.target?.result as string
            const optimized = await optimizeBase64Image(base64, maxWidth, quality)
            resolve(optimized)
          } catch (error) {
            reject(error)
          }
        }

        reader.onerror = () => {
          reject(new Error('Erreur lors de la lecture du fichier'))
        }

        reader.readAsDataURL(file)
      })
    } catch (error: any) {
      imageError.value = error.message
      throw error
    } finally {
      imageLoading.value = false
    }
  }

  // Fonction pour créer une URL d'image optimisée
  const createOptimizedImageUrl = (base64: string, contentType?: string): string => {
    if (contentType) {
      return `data:${contentType};base64,${base64}`
    }
    return base64
  }

  // Fonction pour vérifier si une image est valide
  const validateImage = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      imageError.value = "Format d'image non supporté. Utilisez JPEG, PNG ou WebP."
      return false
    }

    if (file.size > maxSize) {
      imageError.value = "L'image est trop volumineuse. Taille maximum : 5MB."
      return false
    }

    return true
  }

  // Computed pour l'état de chargement
  const isLoading = computed(() => imageLoading.value)
  const hasError = computed(() => imageError.value !== null)

  return {
    // État
    imageLoading,
    imageError,
    isLoading,
    hasError,

    // Fonctions
    optimizeBase64Image,
    loadAndOptimizeImage,
    createOptimizedImageUrl,
    validateImage,

    // Utilitaires
    clearError: () => {
      imageError.value = null
    }
  }
}
