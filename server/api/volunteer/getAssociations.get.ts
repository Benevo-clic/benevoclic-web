import { defineEventHandler, getCookie } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')
  const { volunteerId } = getQuery(event) as { volunteerId?: string }
  if (!volunteerId) {
    throw createError({
      statusCode: 400,
      message: 'Volunteer ID is required'
    })
  }

  try {
    const { data } = await axios.get(
      `${config.private.api_base_url}/api/v2/association/${volunteerId}/getAssociation`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(
        error,
        'Erreur lors de la récupération des associations du volontaire'
      )
    }
  }
})
