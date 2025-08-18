import { defineEventHandler, getCookie, createError } from 'h3'
import { UserInfo } from '~/common/types/auth.type'
import { RetryManager } from '~/utils/retry-manager'
import { ApiError } from '~/utils/error-handler'
import axios from 'axios'

export default defineEventHandler(async event => {
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: {
        message: "Token d'authentification manquant",
        error: 'Unauthorized',
        statusCode: 401
      }
    })
  }

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
    const response = await RetryManager.get<UserInfo>(`${apiBaseUrl}/user/current-user`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      retry: {
        timeout: 10000,
        maxRetries: 3
      }
    })

    if (!response.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: {
          message: 'Données utilisateur invalides',
          error: 'Bad Request',
          statusCode: 400
        }
      })
    }

    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de la récupération de l’utilisateur actuel')
    }
  }
})
