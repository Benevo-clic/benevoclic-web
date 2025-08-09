import { defineEventHandler, createError, getCookie } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  try {
    const { associationId, volunteerId } = event.context.params || {}

    // Récupérer le token depuis les headers
    const token = getCookie(event, 'auth_token')

    // Appel au service backend
    const config = useRuntimeConfig()
    const url = `${config.private.api_base_url}/association/waiting-list/${associationId}/${volunteerId}`

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error: any) {
    console.error(
      '❌ Error in association/waiting-list/[associationId]/[volunteerId].get.ts:',
      error
    )
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, "Erreur lors de la récupération de la liste d'attente")
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors de la récupération de la liste d'attente"
    })
  }
})
