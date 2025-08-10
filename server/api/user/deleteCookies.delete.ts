import { defineEventHandler, createError, deleteCookie, H3Event, EventHandlerRequest } from 'h3'

export function deleteCookies(event: H3Event<EventHandlerRequest>) {
  deleteCookie(event, 'auth_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/'
  })

  deleteCookie(event, 'refresh_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/'
  })

  deleteCookie(event, 'isConnected')
  deleteCookie(event, 'id_user')
  deleteCookie(event, 'userRole')
  deleteCookie(event, 'email')
  deleteCookie(event, 'tempPassword')
}

export default defineEventHandler(async event => {
  try {
    deleteCookies(event)
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.message || 'Échec de la déconnexion'
    })
  }
})
