import { createError, defineEventHandler, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig()
    const { adminId } = event.context.params || {}

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Token d'authentification requis"
      })
    }

    return await $fetch(
      `${config.private.api_base_url}/admin/${adminId}/check-approval-status`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  } catch (error: any) {
    console.error(
      "Erreur lors de la vérification du statut d'approbation:",
      error
    )

    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage:
          error.statusMessage || 'Erreur lors de la vérification du statut'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
})
