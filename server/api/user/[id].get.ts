import { defineEventHandler, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async event => {
  try {
    const userId = getRouterParam(event, 'id')

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID utilisateur requis'
      })
    }

    const apiBaseUrl = process.env.API_BASE_URL || 'https://api.www.benevoclic.fr'

    await axios.get(`${apiBaseUrl}/user/${userId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await axios.get(`${apiBaseUrl}/user/${userId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error: any) {
    console.error('Erreur lors de la récupération des détails utilisateur:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || 'Erreur lors de la récupération des détails utilisateur',
      data: {
        message: error.message || 'Erreur inattendue',
        details: error.data || error
      }
    })
  }
})
