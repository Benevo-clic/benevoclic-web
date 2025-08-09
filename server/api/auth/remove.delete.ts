import { defineEventHandler, readBody, getCookie } from 'h3'
import axios from 'axios'
import { deleteCookies } from '~/server/api/auth/logout.post'
import { useRuntimeConfig } from '#imports'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()

  try {
    const removeResponse = await axios.delete(
      `${config.private.api_base_url}/user/${body.uid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (!removeResponse) {
      throw new Error("Erreur lors de la suppression de l'utilisateur")
    }

    deleteCookies(event)
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(
        error,
        'Erreur lors de la suppression de l’utilisateur'
      )
    }
  }
})
