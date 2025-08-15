import { defineEventHandler, getRouterParam, getCookie, createError } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/error-handler'

export default defineEventHandler(async event => {
  const token = getCookie(event, 'auth_token')
  const id = getRouterParam(event, 'id')
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
  const url = `${apiBaseUrl}/support/reports/${id}`

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 5000
    })
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de la récupération du ticket')
    }
    throw createError({
      statusCode: error?.response?.status || 500,
      statusMessage: 'Erreur lors de la récupération du ticket'
    })
  }
})
