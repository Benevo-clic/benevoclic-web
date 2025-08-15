import { defineEventHandler, createError, getCookie } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/error-handler'

export default defineEventHandler(async event => {
  try {
    const { id } = event.context.params || {}

    const token = getCookie(event, 'auth_token')

    // Appel au service backend
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
    const url = `${apiBaseUrl}/user/avatar/${id}`

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    })

    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, "Erreur lors de la récupération de l'avatar")
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors de la récupération de l'avatar"
    })
  }
})
