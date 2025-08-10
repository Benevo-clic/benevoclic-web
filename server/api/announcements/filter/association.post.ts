import { defineEventHandler, getCookie, readBody } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'
import {
  FilterAnnouncementResponse,
  type FilterAssociationAnnouncement
} from '~/common/interface/filter.interface'

export default defineEventHandler(async event => {
  const token = getCookie(event, 'auth_token')
  const body = (await readBody(event)) as FilterAssociationAnnouncement

  // Utiliser process.env directement au lieu de useRuntimeConfig()
  const apiBaseUrl = process.env.API_BASE_URL
  
  // Debug: Afficher les variables d'environnement
  console.log("🔍 Debug - Variables d'environnement (association.post.ts):", {
    api_base_url: apiBaseUrl
  })

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

  try {
    const payload: any = {
      ...body
    } as FilterAssociationAnnouncement
    if (Array.isArray(payload.tags) && payload.tags.length === 0) {
      delete payload.tags
    }
    const response = await axios.post<FilterAnnouncementResponse>(
      `${apiBaseUrl}/announcements/filter/association`,
      {
        ...payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la récupération des annonces par association')
    }
  }
})
