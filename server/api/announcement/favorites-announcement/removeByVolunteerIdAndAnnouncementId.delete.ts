import axios from 'axios'
import {defineEventHandler, readBody} from "h3";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const volunteerId = body.volunteerId as string;
    const announcementId = body.announcementId as string;
    const config = useRuntimeConfig();
    const token = getCookie(event, 'auth_token')


    try {
        const url = `${config.private.api_base_url}/favorites-announcement/${volunteerId}/${announcementId}`;
        const response = await axios.delete(url,
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
