import { defineEventHandler, getQuery } from 'h3';
import axios from 'axios'
import {Announcement} from "~/common/interface/event.interface";
import {ApiError} from "~/utils/ErrorHandler";
import {getCookie} from "h3";


export default defineEventHandler(async (event) => {
    const associationId = event.context.params?.id;
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();
    if (!associationId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Association ID is required',
        });
    }

    try {

        const response = await axios.get<Announcement>(`${config.private.api_base_url}/announcements/association/${associationId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

        return response.data;
    }catch (error) {
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de la récupération des annonces par association');
        }
    }


});