import axios from 'axios'
import { defineEventHandler } from 'h3'
import { FavoritesAnnouncement } from '~/common/interface/event.interface'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  const volunteerId = event.context.params?.id
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

  if (!volunteerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'volunteer ID is required'
    })
  }

  try {
    const response = await axios.get<FavoritesAnnouncement[]>(
      `${apiBaseUrl}/favorites-announcement/${volunteerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la récupération des annonces favorites')
    }
  }
})
