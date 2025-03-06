import { defineEventHandler, getCookie, createError } from 'h3'
import {User} from "~/common/interface/auth.interface";

const API_BASE = process.env.API_BASE_URL

// Types pour la réponse de l'API

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')

  if (!token ) {
    throw createError({
      statusCode: 401,
      message: 'Non authentifié'
    })
  }

  try {
    const currentUser = await $fetch<User>(`${API_BASE}/user/current-user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!currentUser) {
      throw createError({
        statusCode: 404,
        message: 'Utilisateur non trouvé'
      })
    }

    return currentUser
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.message || 'Token invalide'
    })
  }
}) 