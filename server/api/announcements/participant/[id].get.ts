import { defineEventHandler, getCookie } from 'h3'
import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { ApiError } from '~/utils/error-handler'
import { Announcement } from '~/common/interface/event.interface'

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
  const participantId = event.context.params?.id
  if (!participantId) {
    throw createError({
      statusCode: 400,
      message: 'Volunteer ID is required'
    })
  }

  try {
    const { data } = await RetryManager.get(
      `${apiBaseUrl}/announcements/participant/${participantId}`,
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
        'Erreur lors de la récupération des associations en attente pour le volontaire'
      )
    }
  }
})
