import { defineEventHandler, readBody, createError } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  try {
    const { id } = event.context.params || {}
    const body = await readBody(event)

    const token = getCookie(event, 'auth_token')

    // Appel au service backend
    const config = useRuntimeConfig()
    const url = `${config.private.api_base_url}/user/${id}/location`

    const response = await axios.patch(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la mise à jour de la localisation')
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la mise à jour de la localisation'
    })
  }
})
