import { createError, defineEventHandler, getCookie } from 'h3'

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

    return await $fetch(`${apiBaseUrl}/admin/${adminId}/check-approval-status`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 5000
    })
  } catch (error: any) {
    console.error("Erreur lors de la vérification du statut d'approbation:", error)

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
