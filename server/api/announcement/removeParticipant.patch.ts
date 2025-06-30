import axios from 'axios'
import {defineEventHandler, readBody, getCookie, createError} from "h3";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();
    const body = await readBody(event);



    try {
        const url = `${config.private.api_base_url}/announcements/unregister/participant/${body.participantId}/${body.announcementId}`;
        console.log('URL:', url);

        const participantInfo = await axios.patch(url,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

        console.log('Participant removed successfully:', participantInfo.data);

        return participantInfo.data
    } catch (error) {
        console.error('Error creating announcement:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la création de l\'annonce',
            data: error instanceof Error ? error.message : String(error)
        });
    }
});
