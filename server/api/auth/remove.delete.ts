import { defineEventHandler, readBody, getCookie } from 'h3'
import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { deleteCookies } from '~/server/api/auth/logout.post'
import { ApiError } from '~/utils/error-handler'

export default defineEventHandler(async event => {
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

  try {
    const removeResponse = await RetryManager.delete(`${apiBaseUrl}/user/${body.uid}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      retry: {
        timeout: 10000,
        maxRetries: 3
      }
    })
    if (!removeResponse) {
      throw new Error("Erreur lors de la suppression de l'utilisateur")
    }

    deleteCookies(event)
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de la suppression de l’utilisateur')
    }
  }
})
