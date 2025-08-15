import { defineEventHandler } from 'h3'
import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { ApiError } from '~/utils/error-handler'
import { FilterAnnouncement } from '~/common/interface/filter.interface'

export default defineEventHandler(async event => {
  const token = getCookie(event, 'auth_token')
  const body = (await readBody(event)) as FilterAnnouncement

  const apiBaseUrl = process.env.API_BASE_URL

  try {
    const payload: any = {
      ...body
    } as FilterAnnouncement
    if (Array.isArray(payload.tags) && payload.tags.length === 0) {
      delete payload.tags
    }

    const url = `${apiBaseUrl}/announcements/filter`

    const response = await RetryManager.post(
      url,
      {
        ...payload
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        },
        retry: {
          timeout: 10000, // 10 secondes
          maxRetries: 3 // 3 tentatives
        }
      }
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de l’ajout du volontaire à l’association')
    }
  }
})
