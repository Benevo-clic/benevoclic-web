import { defineEventHandler } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'
import { FilterAnnouncement, FilterAnnouncementResponse } from '~/common/interface/filter.interface'

export default defineEventHandler(async event => {
  const body = (await readBody(event)) as FilterAnnouncement

  const apiBaseUrl = process.env.API_BASE_URL

  if (!apiBaseUrl) {
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

    const url = `${apiBaseUrl}/announcements/filter`

    const response = await axios.post<FilterAnnouncementResponse>(
      url,
      {
        ...payload
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de l’ajout du volontaire à l’association')
    }
  }
})
