import { defineEventHandler, readBody } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'
import { FilterAnnouncement, FilterAnnouncementResponse } from '~/common/interface/filter.interface'

export default defineEventHandler(async event => {
  // Utiliser process.env directement au lieu de useRuntimeConfig()
  const apiBaseUrl = process.env.API_BASE_URL

  // Debug: Afficher les variables d'environnement
  console.log("🔍 Debug - Variables d'environnement (announcements.post.ts):", {
    api_base_url: apiBaseUrl
  })

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
  const body = (await readBody(event)) as FilterAnnouncement
  try {
    const payload: any = {
      ...body
    } as FilterAnnouncement
    if (Array.isArray(payload.tags) && payload.tags.length === 0) {
      delete payload.tags
    }

    const url = `${apiBaseUrl}/announcements/filter/announcements`

    const response = await axios.post<FilterAnnouncementResponse>(
      url,
      {
        ...payload
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de l’ajout du volontaire à l’association')
    }
  }
})
