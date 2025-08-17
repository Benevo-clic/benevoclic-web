import { createError, defineEventHandler, getCookie } from 'h3'
import { RetryManager } from '~/utils/retry-manager'

export default defineEventHandler(async event => {
  try {
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

    const { adminId } = event.context.params || {}

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Token d'authentification requis"
      })
    }

    const response = await RetryManager.get(
      `${apiBaseUrl}/admin/${adminId}/check-approval-status`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        retry: {
          timeout: 10000,
          maxRetries: 3
        }
      }
    )

    return response.data
  } catch (error: any) {
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erreur lors de la vérification du statut'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
})
