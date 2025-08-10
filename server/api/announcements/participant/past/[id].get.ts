import { defineEventHandler, getCookie } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  const volunteerId = event.context.params?.id
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')

  if (!volunteerId) {
    throw createError({
      statusCode: 400,
      message: 'Volunteer ID is required'
    })
  }

  try {
    const { data } = await axios.get(
      `${config.private.api_base_url}/announcements/participant/past/${volunteerId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(
        error,
        'Erreur lors de la récupération des associations en attente pour le volontaire'
      )
    }
  }
})
