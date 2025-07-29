import { defineEventHandler, readBody, createError } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    const config = useRuntimeConfig()
    const url = `${config.private.api_base_url}/user/register-user-verified`

    
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de l\'enregistrement vérifié')
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de l\'enregistrement vérifié'
    })
  }
}) 