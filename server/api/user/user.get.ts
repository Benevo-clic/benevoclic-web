import {defineEventHandler, getCookie, createError, readBody} from 'h3'
import {UserInfo} from "~/common/interface/auth.interface";

const API_BASE = process.env.API_BASE_URL

// Types pour la réponse de l'API

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();
    const body = await readBody(event)


    if (!token ) {
        throw createError({
            statusCode: 401,
            message: 'Non authentifié'
        })
    }

    try {
        const currentUser = await $fetch<UserInfo>(`${config.private.api_base_url}/user/${body.id}`, {
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