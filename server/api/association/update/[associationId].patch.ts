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
    const url = `${apiBaseUrl}/association/update/${associationId}`

    const response = await axios.patch(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('✅ Response received:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Error in association/update/[associationId].patch.ts:', error)
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, "Erreur lors de la mise à jour de l'association")
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors de la mise à jour de l'association"
    })
  }
})
