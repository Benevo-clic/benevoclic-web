import { defineEventHandler, createError, getCookie } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  try {
    const { volunteerId } = event.context.params || {}
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
    const url = `${apiBaseUrl}/association/volunteer-list/${volunteerId}`

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error: any) {
    console.error('Erreur API Nuxt :', error)

    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(
        error,
        'Erreur lors de la récupération de toutes les listes de volontaires'
      )
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || 'Erreur lors de la récupération de toutes les listes de volontaires'
    })
  }
})
