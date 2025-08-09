export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()

    const body = await readBody(event)

    // Validation des données requises
    if (!body.type || !body.category || !body.description) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Données manquantes: type, category et description sont requis'
      })
    }

    const token = getCookie(event, 'auth-token')

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await $fetch(
      `${config.private.api_base_url}/support/reports`,
      {
        method: 'POST',
        body,
        headers
      }
    )

    return response
  } catch (error: any) {
    console.error('Erreur lors de la création du signalement:', error)

    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage:
          error.statusMessage || 'Erreur lors de la création du signalement'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
})
