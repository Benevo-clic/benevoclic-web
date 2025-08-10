import axios from 'axios'
import { defineEventHandler, createError } from 'h3'
import { Announcement } from '~/common/interface/event.interface'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  try {
    const response = await axios.get<Announcement[]>(
      `${config.private.api_base_url}/announcements/allAnnouncements`
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la récupération des annonces')
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne serveur'
    })
  }
})
