export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth-token')
    const config = useRuntimeConfig();


    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token d\'authentification requis'
      })
    }

    return await $fetch(`${config.private.api_base_url}/admin/support-reports`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  } catch (error: any) {
    console.error('Erreur lors de la récupération des tickets:', error)
    
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erreur lors de la récupération des tickets'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
}) 