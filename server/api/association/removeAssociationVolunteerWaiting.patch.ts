import axios from 'axios'
import { defineEventHandler, getCookie, createError } from "h3";
import {ApiError} from "~/utils/ErrorHandler";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();
    const query = getQuery(event);
    if (!query.associationId || !query.volunteerId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            data: {
                message: 'Association ID and Volunteer ID are required'
            }
        });
    }


    try {
        const url = `${config.private.api_base_url}/api/v2/association/${query.associationId}/removeAssociationVolunteersWaiting/${query.volunteerId}`;
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
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de la suppression du volontaire de la liste d’attente de l’association');
        }
    }
});
