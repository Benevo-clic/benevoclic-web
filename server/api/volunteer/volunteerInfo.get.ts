import {defineEventHandler, getCookie} from "h3";
import axios from 'axios';




export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const token = getCookie(event, 'auth_token')
    const { userId } = getQuery(event) as { userId?: string }

    try {
        const { data } = await axios.get(
            `${config.private.api_base_url}/volunteer/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return data
    } catch (error: any) {
        if (error.response?.status === 401) {
            throw createError({
                statusCode: 401,
                message: 'Token invalide'
            });
        }
        throw error;
    }
})