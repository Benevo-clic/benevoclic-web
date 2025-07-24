import axios from 'axios';
import { defineEventHandler } from 'h3';
import {ApiError} from "~/utils/ErrorHandler";
import {FilterAnnouncementResponse} from "~/common/interface/filter.interface";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const token = getCookie(event, 'auth_token');
    const config = useRuntimeConfig();

    if(!body.volunteerId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'volunteer ID is required',
        });
    }
    try {
        const response = await axios.post<FilterAnnouncementResponse[]>(
            `${config.private.api_base_url}/favorites-announcement/filter/${body.volunteerId}/favoritesVolunteer`,
            {
                ...body.filter,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de la récupération des annonces favorites');
        }
    }
});