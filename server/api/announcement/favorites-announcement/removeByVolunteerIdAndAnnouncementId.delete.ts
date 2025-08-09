import axios from 'axios'
import { defineEventHandler, readBody } from 'h3'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const volunteerId = body.volunteerId as string
  const announcementId = body.announcementId as string
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')

  if (!volunteerId || !announcementId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Volunteer ID and Announcement ID are required'
    })
  }

  try {
    const url = `${config.private.api_base_url}/favorites-announcement/${volunteerId}/${announcementId}`
    const response = await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(
        error,
        'Erreur lors de la suppression du favori de l’annonce'
      )
    }
  }
})
