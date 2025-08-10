import axios from 'axios'
import { defineEventHandler, readBody, getCookie } from 'h3'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    const url = `${config.private.api_base_url}/announcements/unregister/participant/${body.participantId}/${body.announcementId}`

    const participantInfo = await axios.patch(
      url,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    return participantInfo.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la suppression du participant')
    }
  }
})
