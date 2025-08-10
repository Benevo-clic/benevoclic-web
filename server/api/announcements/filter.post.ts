import { defineEventHandler } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'
import { FilterAnnouncement, FilterAnnouncementResponse } from '~/common/interface/filter.interface'

export default defineEventHandler(async event => {
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()
  const body = (await readBody(event)) as FilterAnnouncement

  // Debug: Afficher la configuration pour diagnostiquer
  console.log('🔍 Debug - Configuration runtime:', {
    api_base_url: config.private.api_base_url,
    api_sirene_url: config.private.api_sirene_url,
    api_sirene_key: config.private.api_sirene_key ? 'DÉFINIE' : 'NON DÉFINIE'
  })

  // Vérification de la configuration
  if (!config.private.api_base_url) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration Error',
      data: {
        message: 'API_BASE_URL is not configured',
        details: 'Please check your environment variables',
        debug: {
          config_private: Object.keys(config.private),
          env_vars: {
            API_BASE_URL: process.env.API_BASE_URL,
            NODE_ENV: process.env.NODE_ENV
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

    const url = `${config.private.api_base_url}/announcements/filter`

    const response = await axios.post<FilterAnnouncementResponse>(
      url,
      {
        ...payload
      },
      {
        withCredentials: true,
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
