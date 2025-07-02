import {defineEventHandler, getCookie, createError} from 'h3'
import {UserInfo} from '~/common/types/auth.type'


// Types pour la réponse de l'API

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();
    const id = event.context.params?.id;

    try {
        const currentUser = await $fetch<UserInfo>(`${config.private.api_base_url}/user/${id}`, {
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