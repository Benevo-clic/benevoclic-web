// server/api/volunteer/[id].delete.ts
import { defineEventHandler, getCookie, createError } from 'h3'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'
import { deleteCookies } from '~/server/api/auth/logout.post'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Token manquant' })
  }

  const { id } = event.context.params as { id?: string }
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: 'Volunteer ID is required' }
    })
  }

  try {
    const { data: removeData } = await axios.delete<{ volunteerId: string }>(
      `${config.private.api_base_url}/volunteer/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    deleteCookies(event)
    return {
      message: 'Volunteer removed successfully',
      data: removeData.volunteerId
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la mise à jour de l’avatar')
    }
  }
})
