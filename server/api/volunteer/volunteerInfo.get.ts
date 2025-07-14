import {defineEventHandler, getCookie} from "h3";
import axios from 'axios';




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
        console.error(`Error fetching volunteer info: ${error.message}`);
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: error.response?.statusText || 'Erreur serveur',
            data: {
                message: 'Failed to fetch volunteer info',
                error: error.message
            }
        });
    }
})