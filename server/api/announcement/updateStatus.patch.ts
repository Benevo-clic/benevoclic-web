import axios from 'axios'
import { defineEventHandler, readBody, getCookie } from 'h3'
import type { Announcement } from '~/common/interface/event.interface'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()

  try {
    const url = `${config.private.api_base_url}/announcements/updateStatus/${body.announcementId}`
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
