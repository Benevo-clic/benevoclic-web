import { defineEventHandler, readBody, createError, getCookie } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async (event) => {
  try {
    const { associationId } = event.context.params || {}
    const body = await readBody(event)

    const token = getCookie(event, 'auth_token')

    const config = useRuntimeConfig()
    const url = `${config.private.api_base_url}/association/volunteer/add/${associationId}`

    const response = await axios.patch(url, body, {
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
        "Erreur lors de l'ajout du volontaire à l'association"
      )
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage ||
        "Erreur lors de l'ajout du volontaire à l'association"
    })
  }
})
