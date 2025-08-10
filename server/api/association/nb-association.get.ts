import { defineEventHandler, createError } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  try {
    const config = useRuntimeConfig()
    const url = `${config.private.api_base_url}/association/nb-association`

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response.data as { nbAssociation: number }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la récupération de toutes les associations')
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || 'Erreur lors de la récupération de toutes les associations'
    })
  }
})
