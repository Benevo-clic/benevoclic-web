import axios from 'axios'
import { defineEventHandler, readBody, getCookie } from "h3";
import {ApiError} from "~/utils/ErrorHandler";

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
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de l’ajout du volontaire à la liste d’attente de l’association');
        }
    }
});
