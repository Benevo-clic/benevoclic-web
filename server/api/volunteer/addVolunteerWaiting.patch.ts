import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { defineEventHandler, readBody, getCookie } from 'h3'
import { ApiError } from '~/utils/error-handler'

export default defineEventHandler(async event => {
  const body = await readBody(event)
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

  try {
    const url = `${apiBaseUrl}/api/v2/association/${body.associationId}/addAssociationVolunteersWaiting`
    const volunteer = {
      id: body.volunteerId,
      name: body.volunteerName
    }
    const volunteerInfo = await RetryManager.patch(
      url,
      {
        ...volunteer
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        retry: {
          timeout: 10000, // 10 secondes
          maxRetries: 3 // 3 tentatives
        }
      }
    )

    return volunteerInfo.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(
        error,
        'Erreur lors de l’ajout du volontaire à la liste d’attente de l’association'
      )
    }
  }
})
