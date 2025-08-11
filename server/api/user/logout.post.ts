import { defineEventHandler, H3Event, EventHandlerRequest, deleteCookie, getCookie } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

export function deleteCookies(event: H3Event<EventHandlerRequest>) {
  deleteCookie(event, 'auth_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
  })

  deleteCookie(event, 'refresh_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
  })

  deleteCookie(event, 'isConnected')
  deleteCookie(event, 'id_user')
}

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

  try {
    await axios.post(
      `${apiBaseUrl}/user/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    deleteCookies(event)

    return {
      success: true,
      message: 'Déconnexion réussie'
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la déconnexion')
    }
  }
})
