import { defineEventHandler, getCookie, createError } from 'h3'
import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { ApiError } from '~/utils/error-handler'

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

  const url = `${apiBaseUrl}/support/reports`

  try {
    const response = await RetryManager.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      retry: {
        timeout: 10000,
        maxRetries: 3
      }
    })
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de la récupération des tickets de support')
    }
    throw createError({
      statusCode: error?.response?.status || 500,
      statusMessage: 'Erreur lors de la récupération des tickets de support'
    })
  }
})
