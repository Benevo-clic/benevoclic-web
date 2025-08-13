import { defineEventHandler, getCookie, readBody } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'
import { Announcement } from '~/common/interface/event.interface'

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
    console.log(
      `Updating announcement visibility for associationId:`,
      JSON.stringify(body, null, 2)
    )
    await axios.patch(
      `${apiBaseUrl}/announcements/updateAnnouncementVisibility/${body.associationId}/${body.eventVisibility}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la mise à jour de l’annonce')
    }
  }
})
