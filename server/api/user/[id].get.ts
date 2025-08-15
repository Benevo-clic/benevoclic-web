import { defineEventHandler, createError } from 'h3'
import { RetryManager } from '~/utils/retry-manager'

export default defineEventHandler(async event => {
  try {
    const userId = getRouterParam(event, 'id')

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID utilisateur requis'
      })
    }

    const apiBaseUrl = process.env.API_BASE_URL

    const response = await RetryManager.get(`${apiBaseUrl}/user/${userId}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      retry: {
        timeout: 10000, // 10 secondes
        maxRetries: 3 // 3 tentatives
      }
    })

    return response.data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || 'Erreur lors de la récupération des détails utilisateur',
      data: {
        message: error.message || 'Erreur inattendue',
        details: error.data || error
      }
    })
  }
})
