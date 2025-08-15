export default defineEventHandler(async event => {
  try {
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

    const body = await readBody(event)

    // Validation des données requises
    if (!body.type || !body.category || !body.description) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données manquantes: type, category et description sont requis'
      })
    }

    const token = getCookie(event, 'auth-token')

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return await $fetch(`${apiBaseUrl}/support/reports`, {
      method: 'POST',
      body,
      headers,
      retry: {
        timeout: 10000, // 10 secondes
        maxRetries: 3 // 3 tentatives
      }
    })
  } catch (error: any) {
    console.error('Erreur lors de la création du signalement:', error)

    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erreur lors de la création du signalement'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
})
