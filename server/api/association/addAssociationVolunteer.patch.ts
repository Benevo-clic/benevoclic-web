import axios from 'axios'
import { defineEventHandler, readBody, getCookie, createError } from "h3";
import {ApiError} from "~/utils/ErrorHandler";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();
    const query = getQuery(event);
    if (!query.associationId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            data: {
                message: 'Association ID is required'
            }
        });
    }


    try {
        const url = `${config.private.api_base_url}/api/v2/association/${query.associationId}/addAssociationVolunteers`;
        const volunteer = {
            id: body.id,
            name: body.name
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
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de l’ajout du volontaire à l’association');
        }
    }
});
