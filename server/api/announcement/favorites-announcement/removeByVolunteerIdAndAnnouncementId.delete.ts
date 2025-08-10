import axios from 'axios'
import { defineEventHandler, readBody } from 'h3'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const volunteerId = body.volunteerId as string
  const announcementId = body.announcementId as string
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

  if (!volunteerId || !announcementId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Volunteer ID and Announcement ID are required'
    })
  }

  try {
    const url = `${apiBaseUrl}/favorites-announcement/${volunteerId}/${announcementId}`
    const response = await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la suppression du favori de l’annonce')
    }
  }
})
