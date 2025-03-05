import { defineEventHandler, readBody, createError } from 'h3'

const API_BASE = process.env.API_BASE_URL

interface LoginResponse {
    idToken: string
    refreshToken: string
    expiresIn: string
  }

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
    const response = await $fetch<LoginResponse>(`${API_BASE}/user/login`, {
      method: 'POST',
      body: {
        email: body.email,
        password: body.password
      }
    })

    if (!response.idToken) {
      throw createError({
        statusCode: 401,
        message: 'Token manquant dans la réponse'
      })
    }
    
    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.message || "Échec de l'authentification"
    })
  }
}) 