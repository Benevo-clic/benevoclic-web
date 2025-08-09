import axios from 'axios'
import { defineEventHandler, readBody, getCookie } from 'h3'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async (event) => {
  const announcementId = event.context.params?.id
  const body = await readBody(event)
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()

  try {
    const url = `${config.private.api_base_url}/announcements/volunteerWaiting/register/${announcementId}`
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
        }
      }
    )

    return volunteerInfo.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de l’inscription au volontaire')
    }
  }
})
