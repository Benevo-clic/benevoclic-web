import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { defineEventHandler, readBody, getCookie } from 'h3'
import { ApiError } from '~/utils/error-handler'

export default defineEventHandler(async event => {
  const body = await readBody(event)
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
  const announcementId = event.context.params?.id

  try {
    const url = `${apiBaseUrl}/announcements/updateStatus/${announcementId}`
    const status = {
      status: body.status
    }
    const announcement = await RetryManager.patch(
      url,
      {
        ...status
      },
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

    return announcement.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, "Erreur lors de la mise à jour du statut de l'annonce")
    }
  }
})
