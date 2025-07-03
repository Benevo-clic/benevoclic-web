import axios from 'axios'
import { defineEventHandler, readBody, getCookie, createError } from "h3";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();
    const query = getQuery(event);


    try {
        const url = `${config.private.api_base_url}/api/v2/association/${query.associationId}/removeAssociationVolunteers/${query.volunteerId}`;

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
        console.error('Error removing volunteer from association:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            data: {
                message: 'Failed to remove volunteer from association',
                error: error.message
            }
        });

    }
});
