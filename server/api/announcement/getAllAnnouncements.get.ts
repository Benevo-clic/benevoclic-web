import { defineEventHandler } from 'h3'
import axios from 'axios'
import { Announcement } from '~/common/interface/event.interface'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  try {
    const response = await axios.get<Announcement>(`${config.private.api_base_url}/announcements`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la récupération des annonces')
    }
  }
})
