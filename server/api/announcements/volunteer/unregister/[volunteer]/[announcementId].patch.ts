import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { defineEventHandler, getCookie } from 'h3'
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

  const announcementId = getRouterParam(event, 'announcementId')
  const volunteer = getRouterParam(event, 'volunteer')

  try {
    const url = `${apiBaseUrl}/announcements/volunteer/unregister/${volunteer}/${announcementId}`
    const volunteerInfo = await RetryManager.patch(
      url,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        retry: {
          timeout: 10000,
          maxRetries: 3
        }
      }
    )

    return volunteerInfo.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de la suppression du volontaire')
    }
  }
})
