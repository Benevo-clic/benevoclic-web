import { defineEventHandler, getCookie, readBody } from 'h3'
import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { ApiError } from '~/utils/error-handler'
import { type FilterAssociationAnnouncement } from '~/common/interface/filter.interface'

export default defineEventHandler(async event => {
  const token = getCookie(event, 'auth_token')
  const body = (await readBody(event)) as FilterAssociationAnnouncement

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
    } as FilterAssociationAnnouncement
    if (Array.isArray(payload.tags) && payload.tags.length === 0) {
      delete payload.tags
    }
    const response = await RetryManager.post(
      `${apiBaseUrl}/announcements/filter/association`,
      {
        ...payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        retry: {
          timeout: 10000,
          maxRetries: 3
        }
      }
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(
        error,
        'Erreur lors de la récupération des annonces par association'
      )
    }
  }
})
