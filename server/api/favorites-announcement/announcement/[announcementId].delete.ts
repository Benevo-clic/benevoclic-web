import { defineEventHandler, createError } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async (event) => {
  try {
    const { announcementId } = event.context.params || {}

    const token = getCookie(event, 'auth_token')

    const config = useRuntimeConfig()
    const url = `${config.private.api_base_url}/favorites-announcement/announcement/${announcementId}`

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('✅ Response received:', response.data)
    return response.data
  } catch (error: any) {
    console.error(
      '❌ Error in favorites-announcement/announcement/[announcementId].delete.ts:',
      error
    )
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(
        error,
        "Erreur lors de la suppression de tous les favoris de l'annonce"
      )
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage ||
        "Erreur lors de la suppression de tous les favoris de l'annonce"
    })
  }
})
