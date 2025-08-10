import { defineEventHandler, getQuery, getCookie, readBody } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'
import type { InfoVolunteer } from '~/common/interface/event.interface'

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
  const body = (await readBody(event)) as InfoVolunteer
  const query = getQuery(event) as { announcementId: string }

  try {
    console.log(
      `Mise à jour de la présence du participant pour l'annonce ${query.announcementId} avec les données :`,
      body
    )
    const response = await axios.patch(
      `${apiBaseUrl}/announcements/presence/participant/${query.announcementId}`,
      {
        id: body.id,
        name: body.name,
        isPresent: body.isPresent
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la mise à jour de l’annonce')
    }
  }
})
