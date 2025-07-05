import { defineEventHandler, readBody } from "h3";
import type {UserInfo} from "~/common/types/auth.type";
import axios from 'axios'


export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();
    const token  = getCookie(event, 'auth_token')

    try {
        const response = await axios.patch<UserInfo>(`${config.private.api_base_url}/user/${body.id}/isCompleted/${body.isCompleted}`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })

        return response.data;

    }catch (error: any) {
        console.error(`Error updating user completion status: ${error.message}`);
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: error.response?.statusText || 'Erreur serveur',
            data: {
                message: 'Failed to update user completion status',
                error: error.message
            }
        });

    }

});