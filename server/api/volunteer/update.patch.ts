import axios from 'axios'
import { defineEventHandler, readBody } from 'h3'
import { ApiError } from '~/utils/error-handler'

export default defineEventHandler(async event => {
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
  const { id } = getQuery(event) as { id?: string }
  const body = await readBody(event)
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Volunteer ID is required'
      }
    })
  }

  try {
    const response = await axios.patch(
      `${apiBaseUrl}/volunteer/${id}`,
      {
        ...body
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        timeout: 5000
      }
    )
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de la mise à jour du volontaire')
    }
  }
})
