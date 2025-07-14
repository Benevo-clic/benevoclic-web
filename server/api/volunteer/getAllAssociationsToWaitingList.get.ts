import {defineEventHandler, getCookie} from "h3";
import axios from 'axios';
import type {AssociationVolunteerFollow} from "~/common/interface/volunteer.interface";




export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const token = getCookie(event, 'auth_token')
    const { volunteerId } = getQuery(event) as { volunteerId?: string }
    if (!volunteerId) {
        throw createError({
            statusCode: 400,
            message: 'Volunteer ID is required'
        });
    }

    try {
        const { data } = await axios.get<AssociationVolunteerFollow[]>(
            `${config.private.api_base_url}/api/v2/association/${volunteerId}/AllAssociationsVolunteerFromWaitingList`,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        return data
    } catch (error: any) {
        console.error(`Error fetching associations from waiting list: ${error.message}`);
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: error.response?.statusText || 'Erreur serveur',
            data: {
                message: 'Failed to fetch associations from waiting list',
                error: error.message
            }
        });
    }
})