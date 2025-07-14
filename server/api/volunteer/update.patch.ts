import axios from 'axios'
import { defineEventHandler, readBody } from "h3";




export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig()
    const { id } = getQuery(event) as { id?: string }
    const body = await readBody(event);
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            data: {
                message: 'Volunteer ID is required'
            }
        });
    }



        try {

        const response = await axios.patch(
            `${config.private.api_base_url}/volunteer/${id}`,
            {
                ...body,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            }
        )
        return response.data;

    }catch (error: any) {
        console.error(`Error updating volunteer: ${error.message}`);
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: error.response?.statusText || 'Internal Server Error',
            data: {
                message: 'Failed to update volunteer',
                error: error.message
            }
        });

    }
}
);