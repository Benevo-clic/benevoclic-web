import { defineEventHandler, readBody, createError,deleteCookie, setCookie } from 'h3'

const API_BASE = process.env.API_BASE_URL

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')

  try {
    await $fetch(`${API_BASE}/user/logout`, {
      method: 'POST',
      headers: {
            'Authorization': `Bearer ${token}`
      }
    });

    deleteCookie(event, 'auth_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/'
    });
    
    deleteCookie(event, 'refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/'
    });

    setCookie(event,'isConnected','false');

    return {
      success: true,
      message: 'Déconnexion réussie'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.message || "Échec de la déconnexion"
    })
  }
})