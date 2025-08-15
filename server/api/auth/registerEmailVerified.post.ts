import { defineEventHandler, readBody } from 'h3'
import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { login, setCookies } from '~/server/api/auth/login.post'
import { RegisterEmailVerifiedPayload } from '~/common/types/register.type'
import { ApiError } from '~/utils/error-handler'
interface RegisterResponse {
  uid: string
}

export default defineEventHandler(async event => {
  const body = await readBody(event)
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
    await RetryManager.post<RegisterResponse>(
      `${apiBaseUrl}/user/register-user-verified`,
      {
        email: body.email,
        role: body.role
      } as RegisterEmailVerifiedPayload,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        retry: {
          timeout: 10000, // 10 secondes
          maxRetries: 3 // 3 tentatives
        }
      }
    )

    const loginResponse = await login({ email: body.email, password: body.password }, apiBaseUrl)

    setCookies(event, loginResponse)
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de la création du compte')
    }
  }
})
