import { defineEventHandler, createError, getCookie } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  try {
    const { id } = event.context.params || {}

    const token = getCookie(event, 'auth_token')

    // Appel au service backend
    const config = useRuntimeConfig()
    const url = `${config.private.api_base_url}/user/avatar/${id}`

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, "Erreur lors de la récupération de l'avatar")
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors de la récupération de l'avatar"
    })
  }
})
