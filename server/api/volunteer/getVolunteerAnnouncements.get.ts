import { defineEventHandler, getCookie } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

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
    const { data } = await axios.get(`${apiBaseUrl}/announcements/volunteer/${volunteerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(
        error,
        'Erreur lors de la récupération des associations en attente pour le volontaire'
      )
    }
  }
})
