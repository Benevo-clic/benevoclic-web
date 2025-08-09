import { defineEventHandler, createError, getCookie } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async (event) => {
  try {
    const { associationId } = event.context.params || {}

    const token = getCookie(event, 'auth_token')

    const config = useRuntimeConfig()
    const url = `${config.private.api_base_url}/association/delete/${associationId}`

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(
        error,
        "Erreur lors de la suppression de l'association"
      )
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Erreur lors de la suppression de l'association"
    })
  }
})
