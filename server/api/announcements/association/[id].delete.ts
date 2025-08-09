import axios from 'axios'
import { defineEventHandler } from 'h3'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  const associationId = event.context.params?.id
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()

  if (!associationId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Announcement ID is required'
    })
  }

  try {
    await axios.delete<void>(
      `${config.private.api_base_url}/announcements/association/${associationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la suppression de l’annonce')
    }
  }
})
