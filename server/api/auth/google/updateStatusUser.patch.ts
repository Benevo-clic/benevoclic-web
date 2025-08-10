import { defineEventHandler, readBody } from 'h3'
import axios from 'axios'
import type { RegisterUserGoogleResponse } from '~/common/types/auth.type'
import { setCookies } from '~/server/api/auth/login.post'
import { ApiError } from '~/utils/ErrorHandler'

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
  if (!body || !body.idToken) {
    return { error: 'Token manquant' }
  }
  try {
    const response = await axios.patch<RegisterUserGoogleResponse>(
      `${apiBaseUrl}/user/${body.uid}/update-connected/${true}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${body.idToken}`
        }
      }
    )

    setCookies(event, {
      idUser: body.uid,
      idToken: body.idToken,
      refreshToken: body.refreshToken
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de l’authentification avec Google')
    }
  }
})
