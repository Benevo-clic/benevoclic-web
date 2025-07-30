import {defineEventHandler, getCookie} from "h3";
import axios from 'axios';
import {ApiError} from "~/utils/ErrorHandler";
import {Announcement} from "~/common/interface/event.interface";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const token = getCookie(event, 'auth_token')
    const participantId  = event.context.params?.id;
    if (!participantId) {
        throw createError({
            statusCode: 400,
            message: 'Volunteer ID is required'
        });
    }

    try {
        const { data } = await axios.get<Announcement[]>(
            `${config.private.api_base_url}/announcements/participant/${participantId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return data
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de la récupération des associations en attente pour le volontaire');
        }
    }
})