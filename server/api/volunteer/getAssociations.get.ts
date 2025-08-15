import { defineEventHandler, getCookie } from 'h3'
import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { ApiError } from '~/utils/error-handler'

export default defineEventHandler(async event => {
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
  const token = getCookie(event, 'auth_token')
  const { volunteerId } = getQuery(event) as { volunteerId?: string }
  if (!volunteerId) {
    throw createError({
      statusCode: 400,
      message: 'Volunteer ID is required'
    })
  }

  try {
    const { data } = await RetryManager.get(
      `${apiBaseUrl}/api/v2/association/${volunteerId}/getAssociation`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        retry: {
          timeout: 10000, // 10 secondes
          maxRetries: 3 // 3 tentatives
        }
      }
    )
    return data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(
        error,
        'Erreur lors de la récupération des associations du volontaire'
      )
    }
  }
})
