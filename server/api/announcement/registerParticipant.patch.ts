import axios from 'axios'
import { defineEventHandler, readBody, getCookie } from "h3";
import { ApiError } from '~/utils/ErrorHandler';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();



    try {
        const url = `${config.private.api_base_url}/announcements/register/participant/${body.announcementId}`;
        const participant = {
            id: body.id,
            name: body.name
        }
        const participantInfo = await axios.patch(url,
            {
                ...participant,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

        return participantInfo.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de l’inscription au participant')
        }
    }
});
