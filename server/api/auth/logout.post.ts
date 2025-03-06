import { defineEventHandler, readBody, createError } from 'h3'

const API_BASE = process.env.API_BASE_URL

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')

  try {
    await $fetch(`${API_BASE}/user/logout`, {
      method: 'POST',
      headers: {
            'Authorization': `Bearer ${token}`
      }
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.message || "Échec de la déconnexion"
    })
  }
})