import { defineEventHandler, getCookie, getRouterParam, createError } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  const id = getRouterParam(event, 'id')
  const config = useRuntimeConfig()
  const url = `${config.private.api_base_url}/user/${id}`

  try {
    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, "Erreur lors de la suppression de l'utilisateur")
    }
    throw createError({
      statusCode: error?.response?.status || 500,
      statusMessage: "Erreur lors de la suppression de l'utilisateur",
    })
  }
})
