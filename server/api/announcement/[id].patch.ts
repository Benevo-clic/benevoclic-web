import { defineEventHandler, getCookie, readBody } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  const announcementId = event.context.params?.id
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    const response = await axios.patch(
      `${config.private.api_base_url}/announcements/${announcementId}`,
      {
        ...body
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
