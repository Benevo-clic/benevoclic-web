import { defineEventHandler, createError, getCookie } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  try {
    const { associationId, volunteerId } = event.context.params || {}

    // Récupérer le token depuis les headers
    const token = getCookie(event, 'auth_token')

    // Appel au service backend
    const apiBaseUrl = process.env.API_BASE_URL
    if (!apiBaseUrl) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuration Error',
        data: {
          message: 'API_BASE_URL is not configured',
          details: 'Please check your environment variables'
        }
      })
    }
    const url = `${apiBaseUrl}/association/waiting-list/${associationId}/${volunteerId}`

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
