import { defineEventHandler, readBody, createError, getCookie } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

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
    const url = `${apiBaseUrl}/association/volunteer-waiting/register/${associationId}`
    console.log(
      `Registering volunteer in waiting list for association ${associationId} with body:`,
      body
    )

    const response = await axios.patch(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, "Erreur lors de l'enregistrement du volontaire en attente")
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Erreur lors de l'enregistrement du volontaire en attente"
    })
  }
})
