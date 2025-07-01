import axios from 'axios'
import { defineEventHandler, readBody, getCookie, createError } from "h3";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();


    try {
        const url = `${config.private.api_base_url}/api/v2/association/${body.associationId}/removeAssociationVolunteersWaiting/${body.volunteerId}`;

        console.log('URL:', url);

        const volunteerInfo = await axios.patch(url,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

        return volunteerInfo.data
    } catch (error: any) {
        console.error('Error removing volunteer from association waiting list:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            data: {
                message: 'Failed to remove volunteer from association waiting list',
                error: error.message
            }
        });

    }
});
