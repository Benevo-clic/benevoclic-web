import { defineEventHandler, getRouterParam, getCookie, readBody, createError } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler( async (event) => {
  const token = getCookie(event, 'auth_token')
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ status: string }>(event)

  const config = useRuntimeConfig()
  const url = `${config.private.api_base_url}/support/reports/${id}/status`

  try {
    const response = await axios.patch(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la mise à jour du statut du ticket')
    }
    throw createError({
      statusCode: error?.response?.status || 500,
      statusMessage: 'Erreur lors de la mise à jour du statut du ticket',
    })
  }
}) 