import { defineEventHandler, createError } from 'h3'
import axios from 'axios'
import { ApiError } from '~/utils/ErrorHandler'
import { getCookie } from 'h3'


export default defineEventHandler(async (event) => {
  try {
    const { associationId, volunteer } = event.context.params || {}
    
    const token = getCookie(event, 'auth_token');
    
    const config = useRuntimeConfig()
    const url = `${config.private.api_base_url}/association/volunteer-waiting/remove/${associationId}/${volunteer}`

    const response = await axios.patch(url, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la suppression du volontaire en attente')
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la suppression du volontaire en attente'
    })
  }
}) 