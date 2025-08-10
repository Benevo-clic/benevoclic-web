import axios from 'axios'
import { defineEventHandler } from 'h3'
import { FavoritesAnnouncement } from '~/common/interface/event.interface'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  const volunteerId = event.context.params?.id
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()

  if (!volunteerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'volunteer ID is required'
    })
  }

  try {
    const response = await axios.get<FavoritesAnnouncement[]>(
      `${config.private.api_base_url}/favorites-announcement/${volunteerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la récupération des annonces favorites')
    }
  }
})
