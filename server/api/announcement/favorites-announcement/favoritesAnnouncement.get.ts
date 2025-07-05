import axios from 'axios'
import {defineEventHandler, getQuery} from "h3";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const volunteerId = query.volunteerId as string | undefined;
    const announcementId = query.announcementId as string | undefined;
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();

    if (!volunteerId || !announcementId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Volunteer ID and Announcement ID are required',
        });
    }

    try {
        const url = `${config.private.api_base_url}/favorites-announcement/${volunteerId}/${announcementId}`;
        const response = await axios.get(url,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

        return response.data;
    } catch (error) {
        console.error('Error creating favorite announcement:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la création du favori',
            data: error instanceof Error ? error.message : String(error)
        });
    }


});
