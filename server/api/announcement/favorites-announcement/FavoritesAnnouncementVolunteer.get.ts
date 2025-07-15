import axios from 'axios'
import {defineEventHandler, getQuery} from "h3";
import {ApiError} from "~/utils/ErrorHandler";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const volunteerId = query.volunteerId as string | undefined;
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();

    if (!volunteerId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Volunteer ID is required',
        });
    }

    try {
        const url = `${config.private.api_base_url}/favorites-announcement/${volunteerId}/favoritesVolunteer`;
        const response = await axios.get(url,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de la récupération des annonces favorites pour le volontaire');
        }
    }


});
