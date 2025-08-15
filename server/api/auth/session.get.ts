import { defineEventHandler, getCookie, createError } from 'h3'
import { RetryManager } from '~/utils/retry-manager'

export default defineEventHandler(async event => {
  const token = getCookie(event, 'auth_token')
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

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Non authentifié'
    })
  }

  try {
    const response = await RetryManager.get(`${apiBaseUrl}/auth/session`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      retry: {
        timeout: 10000, // 10 secondes
        maxRetries: 3 // 3 tentatives
      }
    })

    return response.data
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw createError({
        statusCode: 401,
        message: 'Session invalide'
      })
    }

    throw createError({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Erreur lors de la vérification de session'
    })
  }
})
