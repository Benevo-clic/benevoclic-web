import { defineEventHandler, deleteCookie } from 'h3'

export default defineEventHandler(async event => {
  try {
    // Supprimer tous les cookies de session
    const cookiesToDelete = [
      'auth_token',
      'refresh_token',
      'session_token',
      'user_session',
      'firebase_token',
      'csrf_token',
      'token',
      'access_token',
      'id_token',
      'user_token',
      'app_token',
      'api_token',
      'bearer_token',
      'jwt_token',
      'login_token',
      'remember_token',
      'auth_session',
      'isConnected',
      'id_user',
      'userRole',
      'email',
      'tempPassword'
    ]

    cookiesToDelete.forEach(cookieName => {
      deleteCookie(event, cookieName, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    })

    return {
      success: true,
      message: 'Tous les cookies de session ont été supprimés'
    }
  } catch (error) {
    console.error('❌ Erreur lors de la suppression des cookies:', error)
    return {
      success: false,
      message: 'Erreur lors de la suppression des cookies'
    }
  }
})
