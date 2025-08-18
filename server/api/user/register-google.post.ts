import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { ApiError } from '~/utils/error-handler'

export interface RegisterUserGoogle {
  idUser: string
  token: string
  expiresIn: number
}
export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)

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
    const url = `${apiBaseUrl}/user/register-google`

    const response = await RetryManager.post<RegisterUserGoogle>(url, body, {
      headers: {
        'Content-Type': 'application/json'
      },
      retry: {
        timeout: 10000,
        maxRetries: 3
      }
    })

    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, "Erreur lors de l'enregistrement Google")
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors de l'enregistrement Google"
    })
  }
})
