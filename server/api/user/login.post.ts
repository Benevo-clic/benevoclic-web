import {
  defineEventHandler,
  readBody,
  createError,
  H3Event,
  EventHandlerRequest,
  setCookie
} from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/error-handler'

export interface LoginResponse {
  idUser: string
  idToken: string
  refreshToken?: string
  expiresIn?: string
}

export function setCookies(event: H3Event<EventHandlerRequest>, loginResponse: LoginResponse) {
  if (loginResponse.idToken) {
    setCookie(event, 'auth_token', loginResponse.idToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 heures
    })

    setCookie(event, 'id_user', loginResponse.idUser, {
      httpOnly: false,
      secure: false,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 jours
    })

    setCookie(event, 'refresh_token', <string>loginResponse.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 jours
    })
    setCookie(event, 'isConnected', 'true', {
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 jours
    })
  } else {
    throw createError({
      statusCode: 401,
      message: 'Token manquant dans la réponse'
    })
  }
}

export async function login(
  payload: { email: string; password: string },
  apiBase: string | undefined
): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    `${apiBase}/user/login`,
    {
      email: payload.email,
      password: payload.password
    },
    {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    }
  )

  return response.data
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
    const loginResponse = await login(
      {
        email: body.email,
        password: body.password
      },
      apiBaseUrl
    )
    setCookies(event, loginResponse)
    return loginResponse
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de la connexion')
    }
  }
})
