import { defineEventHandler, createError } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'
import type { Announcement } from '~/common/interface/event.interface'

export default defineEventHandler(async (event) => {
  try {
    const { volunteerId } = event.context.params || {}

    const token = getCookie(event, 'auth_token')

    const config = useRuntimeConfig()
    const url = `${config.private.api_base_url}/favorites-announcement/volunteer/announcements/${volunteerId}`

    const response = await axios.get<Announcement[]>(url, {
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
        'Erreur lors de la récupération des favoris du volontaire'
      )
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage ||
        'Erreur lors de la récupération des favoris du volontaire'
    })
  }
})
