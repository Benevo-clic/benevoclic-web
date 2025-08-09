export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth-token')
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token d\'authentification requis'
      })
    }

    const reportId = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!body.status) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Statut requis'
      })
    }

    return await $fetch(`${process.env.NUXT_API_BASE_URL}/admin/support-reports/${reportId}/status`, {
      method: 'PATCH',
      body: {
        status: body.status
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du statut:', error)
    
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erreur lors de la mise à jour du statut'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
}) 