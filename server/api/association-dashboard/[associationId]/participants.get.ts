import { defineEventHandler, getCookie, getQuery } from 'h3'
import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { ApiError } from '~/utils/error-handler'

export default defineEventHandler(async event => {
  const associationId = event.context.params?.associationId
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

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  try {
    const query = getQuery(event)
    const queryParams = new URLSearchParams()

    if (query.startDate) {
      queryParams.append('startDate', query.startDate as string)
    }
    if (query.endDate) {
      queryParams.append('endDate', query.endDate as string)
    }
    if (query.eventType) {
      queryParams.append('eventType', query.eventType as string)
    }
    if (query.status) {
      queryParams.append('status', query.status as string)
    }

    const url = `${apiBaseUrl}/association-dashboard/${associationId}/participants${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

    const response = await RetryManager.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      retry: {
        timeout: 15000, // 15 secondes pour les dashboards
        maxRetries: 3 // Moins de tentatives mais plus de temps
      }
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(
        error,
        'Erreur lors de la récupération des statistiques de participants'
      )
    }
  }
})
