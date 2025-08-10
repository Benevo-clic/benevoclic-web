import axios from 'axios'
import { defineEventHandler, readBody, getCookie } from 'h3'
import type { Announcement } from '~/common/interface/event.interface'
import { ApiError } from '~/utils/ErrorHandler'

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
    const url = `${apiBaseUrl}/announcements/updateStatus/${body.announcementId}`
    const status = {
      status: body.status
    }
    const announcement = await axios.patch<Announcement>(
      url,
      {
        ...status
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    return announcement.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, "Erreur lors de la mise à jour du statut de l'annonce")
    }
  }
})
