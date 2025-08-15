import { defineEventHandler, readBody, createError, getCookie } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/error-handler'

export default defineEventHandler(async event => {
  try {
    const { associationId } = event.context.params || {}
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
    const url = `${apiBaseUrl}/association/volunteer/add/${associationId}`

    const response = await axios.patch(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    })

    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, "Erreur lors de l'ajout du volontaire à l'association")
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors de l'ajout du volontaire à l'association"
    })
  }
})
