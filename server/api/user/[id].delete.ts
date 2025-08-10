import { defineEventHandler, createError, readBody, getCookie } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'
import { deleteCookies } from '~/server/api/auth/logout.post'

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
    const removeResponse = await axios.delete(`${apiBaseUrl}/user/${body.uid}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (!removeResponse) {
      throw new Error("Erreur lors de la suppression de l'utilisateur")
    }

    deleteCookies(event)
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la suppression de l’utilisateur')
    }
  }
})
