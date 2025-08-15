// server/api/volunteer/[id].delete.ts
import { defineEventHandler, getCookie, createError } from 'h3'
import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { deleteCookies } from '~/server/api/auth/logout.post'
import { ApiError } from '~/utils/error-handler'

export default defineEventHandler(async event => {
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
  const token = getCookie(event, 'auth_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Token manquant' })
  }

  const { id } = event.context.params as { id?: string }
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: 'Volunteer ID is required' }
    })
  }

  try {
    const { data: removeData } = await RetryManager.delete(`${apiBaseUrl}/volunteer/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      retry: {
        timeout: 10000, // 10 secondes
        maxRetries: 3 // 3 tentatives
      }
    })

    deleteCookies(event)
    return {
      message: 'Volunteer removed successfully',
      data: removeData.volunteerId
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de la mise à jour de l’avatar')
    }
  }
})
