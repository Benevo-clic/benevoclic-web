// server/api/volunteer/[id].delete.ts
import {
    defineEventHandler,
    getCookie,
    createError
} from 'h3'
import { useRuntimeConfig } from '#imports'
import axios from 'axios'
import { deleteCookies } from '~/server/api/auth/logout.post'
import {ApiError} from "~/utils/ErrorHandler";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    // 1️⃣ Récupère le token
    const token = getCookie(event, 'auth_token')
    if (!token) {
        throw createError({ statusCode: 401, statusMessage: 'Token manquant' })
    }

    // 2️⃣ Récupère l’ID depuis le path param
    const { id } = event.context.params as { id?: string }
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            data: { message: 'Volunteer ID is required' }
        })
    }

    try {
        // 3️⃣ Appel DELETE à NestJS
        const { data: removeData } = await axios.delete<{ volunteerId: string }>(
            `${config.private.api_base_url}/volunteer/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        // 4️⃣ On nettoie les cookies et on renvoie le succès
        deleteCookies(event)
        console.log('Volunteer removed successfully:', removeData.volunteerId)
        return {
            message: 'Volunteer removed successfully',
            data:    removeData.volunteerId
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de la mise à jour de l’avatar');
        }
    }
})
