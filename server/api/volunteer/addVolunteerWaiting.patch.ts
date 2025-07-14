import axios from 'axios'
import { defineEventHandler, readBody, getCookie, createError } from "h3";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();


    try {
        const url = `${config.private.api_base_url}/api/v2/association/${body.associationId}/addAssociationVolunteersWaiting`;
        const volunteer = {
            id: body.volunteerId,
            name: body.volunteerName
        }
        const volunteerInfo = await axios.patch(url,
            {
                ...volunteer,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

        return volunteerInfo.data
    } catch (error: any) {
        console.error('Error adding volunteer to association waiting list:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            data: {
                message: 'Failed to add volunteer to association waiting list',
                error: error.message
            }
        });

    }
});
