import {
  defineEventHandler,
  createError,
  H3Event,
  EventHandlerRequest,
  getCookie,
  setCookie
} from 'h3'
import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { LoginResponse } from '~/common/types/auth.type'
import { ApiError } from '~/utils/error-handler'

function setAccessTokenOnly(event: H3Event<EventHandlerRequest>, loginResponse: LoginResponse) {
  if (loginResponse.idToken) {
    setCookie(event, 'auth_token', loginResponse.idToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 heures
    })
  }
}

export default defineEventHandler(async event => {
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
  const refreshToken = getCookie(event, 'refresh_token')

  try {
    if (!refreshToken) {
      return
    }

    const loginResponse = await RetryManager.post<LoginResponse>(
      `${apiBaseUrl}/user/refresh`,
      {
        refreshToken
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        retry: {
          timeout: 10000,
          maxRetries: 3
        }
      }
    )

    setAccessTokenOnly(event, loginResponse.data)

    return loginResponse.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de la récupération de l’utilisateur actuel')
    }
  }
})
