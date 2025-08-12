import axios from 'axios'
import { createError } from 'h3'
import { ApiError } from '~/utils/ErrorHandler'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async event => {
  try {
    const { volunteerId } = event.context.params || {}

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

    const response = await axios.get(`${apiBaseUrl}/settings/volunteer/${volunteerId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la récupération de toutes les associations')
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || 'Erreur lors de la récupération de toutes les associations'
    })
  }
})
