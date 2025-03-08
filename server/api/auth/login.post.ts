import { defineEventHandler, readBody, createError } from 'h3'

const API_BASE = process.env.API_BASE_URL

interface LoginResponse {
    idToken: string
    refreshToken: string
    expiresIn: string
  }

export async function login(payload: { email: string, password: string },apiBase:string | undefined): Promise<LoginResponse> {
  return await $fetch<LoginResponse>(`${apiBase}/user/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: {
      email: payload.email,
      password: payload.password
    }
  })
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
    const response = await login({
        email: body.email,
        password: body.password
    },API_BASE)

    if (response.idToken) {
      setCookie(event, 'auth_token', response.idToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7
      })

      setCookie(event, 'refresh_token', response.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30
      })
      setCookie(event,'isConnected','true')

    }else{
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