import { defineEventHandler } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'
import {
  FilterAnnouncement,
  FilterAnnouncementResponse
} from '~/common/interface/filter.interface'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()
  const body = (await readBody(event)) as FilterAnnouncement

  // Vérification de la configuration
  if (!config.private.api_base_url) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration Error',
      data: {
        message: 'API_BASE_URL is not configured',
        details: 'Please check your environment variables'
      }
    })
  }

  try {
    const payload: any = {
      ...body
    } as FilterAnnouncement
    if (Array.isArray(payload.tags) && payload.tags.length === 0) {
      delete payload.tags
    }

    const url = `${config.private.api_base_url}/announcements/filter`

    const response = await axios.post<FilterAnnouncementResponse>(
      url,
      {
        ...payload
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(
        error,
        'Erreur lors de l’ajout du volontaire à l’association'
      )
    }
  }
})
