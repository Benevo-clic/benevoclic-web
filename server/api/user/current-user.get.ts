import { defineEventHandler, getCookie, createError } from 'h3'
import axios from 'axios'
import { UserInfo } from '~/common/types/auth.type'
import { ApiError } from '~/utils/ErrorHandler'
// Types pour la réponse de l'API

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

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Non authentifié'
    })
  }

  try {
    const currentUser = await axios.get<UserInfo>(`${apiBaseUrl}/user/current-user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!currentUser) {
      throw createError({
        statusCode: 404,
        message: 'Utilisateur non trouvé'
      })
    }

    return currentUser.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la récupération de l’utilisateur actuel')
    }
  }
})
