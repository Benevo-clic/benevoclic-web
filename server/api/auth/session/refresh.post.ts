import { defineEventHandler, getCookie, createError, setCookie } from 'h3'
import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'

export default defineEventHandler(async event => {
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

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Non authentifié'
    })
  }

  try {
    const response = await RetryManager.post(
      `${apiBaseUrl}/auth/session/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        retry: {
          timeout: 10000,
          maxRetries: 3
        }
      }
    )

    const setCookieHeader = response.headers['set-cookie']
    if (setCookieHeader) {
      const sessionCookie = setCookieHeader.find(cookie => cookie.includes('__session'))
      if (sessionCookie) {
        const sessionToken = sessionCookie.split(';')[0].split('=')[1]
        setCookie(event, '__session', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
          path: '/'
        })
      }
    }

    return response.data
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw createError({
        statusCode: 401,
        message: 'Session invalide'
      })
    }

    throw createError({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Erreur lors du rafraîchissement de session'
    })
  }
})
