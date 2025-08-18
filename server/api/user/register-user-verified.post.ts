import { defineEventHandler, readBody, createError } from 'h3'
import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { ApiError } from '~/utils/error-handler'

const processingUsers = new Set<string>()

export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)

    const userKey = `${body.email}-${body.role}`

    if (processingUsers.has(userKey)) {
      return { uid: body.email, message: 'User already being processed' }
    }

    processingUsers.add(userKey)

    try {
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
      const url = `${apiBaseUrl}/user/register-user-verified`

      const response = await RetryManager.post(url, body, {
        headers: {
          'Content-Type': 'application/json'
        },
        retry: {
          timeout: 10000,
          maxRetries: 3
        }
      })

      return response.data
    } finally {
      processingUsers.delete(userKey)
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, "Erreur lors de l'enregistrement vérifié")
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors de l'enregistrement vérifié"
    })
  }
})
