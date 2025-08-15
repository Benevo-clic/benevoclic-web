import axios from 'axios'
import { defineEventHandler } from 'h3'
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
      statusMessage: 'Announcement ID is required'
    })
  }

  try {
    await axios.delete<void>(`${apiBaseUrl}/announcements/${announcementId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 5000
    })
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de la suppression de l’annonce')
    }
  }
})
