import { defineEventHandler, readBody, createError } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

// Cache pour éviter les appels multiples
const processingUsers = new Set<string>()

export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)

    // Créer une clé unique pour cet utilisateur
    const userKey = `${body.email}-${body.role}`

    // Vérifier si l'utilisateur est déjà en cours de traitement
    if (processingUsers.has(userKey)) {
      console.log(`[API] User ${body.email} already being processed, skipping...`)
      return { uid: body.email, message: 'User already being processed' }
    }

    // Ajouter l'utilisateur au cache de traitement
    processingUsers.add(userKey)

    try {
      const config = useRuntimeConfig()
      const url = `${config.private.api_base_url}/user/register-user-verified`

      const response = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      return response.data
    } finally {
      // Retirer l'utilisateur du cache après traitement
      processingUsers.delete(userKey)
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, "Erreur lors de l'enregistrement vérifié")
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors de l'enregistrement vérifié"
    })
  }
})
