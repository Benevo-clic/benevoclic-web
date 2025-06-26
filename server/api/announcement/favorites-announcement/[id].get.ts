


import axios from 'axios';
import { defineEventHandler } from 'h3';
import { FavoritesAnnouncement} from '~/common/interface/event.interface';

export default defineEventHandler(async (event) => {
    const volunteerId = event.context.params?.id;
    const token = getCookie(event, 'auth_token');
    const config = useRuntimeConfig();

    if (!volunteerId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'volunteer ID is required',
        });
    }

    try {
        const response = await axios.get<FavoritesAnnouncement[]>(
            `${config.private.api_base_url}/favorites-announcement/${volunteerId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error(`Error fetching favorites of volunteer ${volunteerId}: ${error.message}`);
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: error.response?.statusText || 'Erreur serveur',
        });
    }
});