import { defineEventHandler, readBody } from 'h3'
import axios from 'axios'
import type { RegisterUserGoogleResponse } from '~/common/types/auth.type'
import { setCookies } from '~/server/api/auth/login.post'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  if (!body || !body.idToken) {
    return { error: 'Token manquant' }
  }
  try {
    const response = await axios.patch<RegisterUserGoogleResponse>(
      `${config.private.api_base_url}/user/${body.uid}/update-connected/${true}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${body.idToken}`
        }
      }
    )

    setCookies(event, {
      idUser: body.uid,
      idToken: body.idToken,
      refreshToken: body.refreshToken
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(
        error,
        'Erreur lors de l’authentification avec Google'
      )
    }
  }
})
