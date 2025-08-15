import { defineEventHandler, readBody } from 'h3'
import { initializeApp } from '@firebase/app'
import { getAuth, signInWithCustomToken } from '@firebase/auth'
import axios from 'axios'
import { setCookies } from '~/server/api/auth/login.post'
import type { RegisterGooglePayload, RegisterUserGoogleResponse } from '~/common/types/auth.type'
import { ApiError } from '~/utils/error-handler'
import { EnvValidator } from '~/utils/env-validator'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const apiBaseUrl = process.env.API_BASE_URL
  if (!apiBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration Error',
      data: {
        message: 'API_BASE_URL is not configured',
        details: 'Please check your environment variables'
      }
    })
  }

  if (!body || !body.idToken) {
    return { error: 'Token manquant' }
  }
  let app
  try {
    app = initializeApp(config.public.firebaseConfig)
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Firebase côté serveur:", error)
    return { error: "Erreur d'initialisation Firebase" }
  }

  const response = await axios.post<RegisterUserGoogleResponse>(
    `${apiBaseUrl}/user/register-google`,
    {
      idToken: body.idToken,
      role: body.role
    } as RegisterGooglePayload,
    {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    }
  )

  if (!response.data.token) {
    return { error: 'Invalid token' }
  }

  const auth = getAuth(app)

  try {
    const userCredential = await signInWithCustomToken(auth, response.data.token)

    const idToken = await userCredential.user.getIdToken()
    const refreshToken = userCredential.user.refreshToken

    setCookies(event, {
      idUser: userCredential.user.uid,
      idToken,
      refreshToken
    })

    return {
      idToken,
      refreshToken
    }
  } catch (error) {
    console.error("Erreur lors de l'authentification avec token personnalisé:", error)
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, "Erreur lors de l'authentification avec Google")
    }
    return { error: "Erreur lors de l'authentification" }
  }
})
