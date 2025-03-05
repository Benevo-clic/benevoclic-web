import { defineEventHandler, getCookie, createError } from 'h3'
import {User} from "~/types/auth";

const API_BASE = process.env.API_BASE_URL

// Types pour la réponse de l'API

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  const userEmail = getCookie(event, 'user_email')
  
  if (!token || !userEmail) {
    throw createError({
      statusCode: 401,
      message: 'Non authentifié'
    })
  }

  try {
    const response = await $fetch<User>(`${API_BASE}/user/email/${userEmail}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })


    if (!response) {
      throw createError({
        statusCode: 404,
        message: 'Utilisateur non trouvé'
      })
    }

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.message || 'Token invalide'
    })
  }
}) 