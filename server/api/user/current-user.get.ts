import { defineEventHandler, getCookie, createError } from 'h3'
import { UserInfo } from '~/common/types/auth.type'
import axios from 'axios'

export default defineEventHandler(async event => {
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: {
        message: "Token d'authentification manquant",
        error: 'Unauthorized',
        statusCode: 401
      }
    })
  }

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
    const response = await axios.get<UserInfo>(`${apiBaseUrl}/user/current-user`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 5000
    })

    if (!response.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: {
          message: 'Données utilisateur invalides',
          error: 'Bad Request',
          statusCode: 400
        }
      })
    }

    return response.data
  } catch (error: any) {
    // Gérer les erreurs sans retry pour éviter la boucle infinie
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw createError({
        statusCode: error.response.status,
        statusMessage: error.response.statusText,
        data: {
          message: 'Token invalide',
          error: error.response.statusText,
          statusCode: error.response.status
        }
      })
    }

    // Pour les autres erreurs
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        message: 'Erreur lors de la récupération des données utilisateur',
        error: error.message,
        statusCode: 500
      }
    })
  }
})
