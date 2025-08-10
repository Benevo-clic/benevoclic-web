import { defineEventHandler, getQuery } from 'h3'
import axios from 'axios'
import { Announcement } from '~/common/interface/event.interface'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  const query = getQuery(event)
  const associationId = query.associationId as string | undefined
  const token = getCookie(event, 'auth_token')
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
  if (!associationId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Association ID is required'
    })
  }

  try {
    const response = await axios.get<Announcement>(
      `${apiBaseUrl}/announcements/association/${associationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la récupération des annonces par association')
    }
  }
})
