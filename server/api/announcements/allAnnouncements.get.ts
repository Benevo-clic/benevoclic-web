import axios from 'axios'
import { defineEventHandler, createError } from 'h3'
import { Announcement } from '~/common/interface/event.interface'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async () => {
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

  try {
    const response = await axios.get<Announcement[]>(`${apiBaseUrl}/announcements/allAnnouncements`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la récupération des annonces')
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne serveur'
    })
  }
})
