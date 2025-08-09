import axios from 'axios'
import { defineEventHandler, getCookie, getQuery } from 'h3'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()
  const query = getQuery(event)

  try {
    const url = `${config.private.api_base_url}/announcements/unregister/volunteer/${query.volunteerId}/${query.announcementId}`
    const volunteerInfo = await axios.patch(
      url,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    return volunteerInfo.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la suppression du volontaire')
    }
  }
})
