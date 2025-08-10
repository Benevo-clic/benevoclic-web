import axios from 'axios'
import { defineEventHandler, getQuery } from 'h3'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  const query = getQuery(event)
  const volunteerId = query.volunteerId as string | undefined
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
      statusMessage: 'Volunteer ID is required'
    })
  }

  try {
    const url = `${apiBaseUrl}/favorites-announcement/${volunteerId}/favoritesVolunteer`
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(
        error,
        'Erreur lors de la récupération des annonces favorites pour le volontaire'
      )
    }
  }
})
