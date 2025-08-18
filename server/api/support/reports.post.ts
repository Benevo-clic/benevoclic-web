import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { ApiError } from '~/utils/error-handler'

export default defineEventHandler(async event => {
  try {
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

    const body = await readBody(event)

    // Validation des données requises
    if (!body.type || !body.category || !body.description) {
      const missingFields = []
      if (!body.type) missingFields.push('type')
      if (!body.category) missingFields.push('category')
      if (!body.description) missingFields.push('description')

      throw createError({
        statusCode: 400,
        statusMessage: `Données manquantes: ${missingFields.join(', ')} sont requis`,
        data: {
          message: `Champs manquants: ${missingFields.join(', ')}`,
          receivedData: body
        }
      })
    }

    const token = getCookie(event, 'auth_token')

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await RetryManager.post(`${apiBaseUrl}/support/reports`, body, {
      headers,
      retry: {
        timeout: 10000,
        maxRetries: 3
      }
    })

    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de la soumission du rapport')
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la soumission du rapport',
      data: {
        message: error.message || 'Une erreur est survenue',
        details: error.response?.data || {}
      }
    })
  }
})
