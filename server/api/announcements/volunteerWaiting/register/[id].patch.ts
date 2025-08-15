import axios from 'axios'
import { defineEventHandler, readBody, getCookie } from 'h3'
import { ApiError } from '~/utils/error-handler'

export default defineEventHandler(async event => {
  const announcementId = event.context.params?.id
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
    const url = `${apiBaseUrl}/announcements/volunteerWaiting/register/${announcementId}`
    const volunteer = {
      id: body.id,
      name: body.name
    }
    const volunteerInfo = await axios.patch(
      url,
      {
        ...volunteer
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        timeout: 5000
      }
    )

    return volunteerInfo.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de l’inscription au volontaire')
    }
  }
})
