import { defineEventHandler, getCookie } from 'h3'
import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { ApiError } from '~/utils/error-handler'

export default defineEventHandler(async event => {
  const announcementId = event.context.params?.id
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
  if (!announcementId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Association ID is required'
    })
  }

  try {
    const response = await RetryManager.get(`${apiBaseUrl}/announcements/${announcementId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      retry: {
        timeout: 10000,
        maxRetries: 3
      }
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(
        error,
        'Erreur lors de la récupération des annonces par association'
      )
    }
  }
})
