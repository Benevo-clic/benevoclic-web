import {defineEventHandler, getCookie} from "h3";
import axios from 'axios';
import {ApiError} from "~/utils/ErrorHandler";




export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const token = getCookie(event, 'auth_token')
    const { userId } = getQuery(event) as { userId?: string }
    if (!userId) {
        throw createError({
            statusCode: 400,
            message: 'User ID is required'
        });
    }

    try {
        const { data } = await axios.get(
            `${config.private.api_base_url}/volunteer/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return data
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de la récupération des informations du volontaire');
        }
    }
})