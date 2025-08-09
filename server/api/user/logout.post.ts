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
  const config = useRuntimeConfig()

  console.log('Déconnexion en cours...')
  try {
    await axios.post(
      `${config.private.api_base_url}/user/logout`,
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
