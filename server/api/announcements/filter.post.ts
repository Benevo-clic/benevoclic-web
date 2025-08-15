import { defineEventHandler } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/error-handler'
import { FilterAnnouncement, FilterAnnouncementResponse } from '~/common/interface/filter.interface'

export default defineEventHandler(async event => {
  const token = getCookie(event, 'auth_token')
  const body = (await readBody(event)) as FilterAnnouncement

  // Utiliser process.env directement au lieu de useRuntimeConfig()
  const apiBaseUrl = process.env.API_BASE_URL
  const apiSireneUrl = process.env.API_SIRENE_URL
  const apiSireneKey = process.env.API_SIRENE_KEY

  // Debug: Afficher les variables d'environnement
  console.log("🔍 Debug - Variables d'environnement:", {
    api_base_url: apiBaseUrl,
    api_sirene_url: apiSireneUrl,
    api_sirene_key: apiSireneKey ? 'DÉFINIE' : 'NON DÉFINIE'
  })

  // Vérification de la configuration
  if (!apiBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration Error',
      data: {
        message: 'API_BASE_URL is not configured',
        details: 'Please check your environment variables',
        debug: {
          env_vars: {
            API_BASE_URL: process.env.API_BASE_URL,
            NODE_ENV: process.env.NODE_ENV,
            PORT: process.env.PORT
          }
        }
      }
    })
  }

  try {
    const payload: any = {
      ...body
    } as FilterAnnouncement
    if (Array.isArray(payload.tags) && payload.tags.length === 0) {
      delete payload.tags
    }

    const url = `${apiBaseUrl}/announcements/filter`

    const response = await axios.post<FilterAnnouncementResponse>(
      url,
      {
        ...payload
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de l’ajout du volontaire à l’association')
    }
  }
})
