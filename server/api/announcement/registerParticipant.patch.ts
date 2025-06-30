import type {CreateAnnouncementDto} from '~/common/interface/event.interface';
import axios from 'axios'
import { defineEventHandler, readBody, getCookie, createError } from "h3";

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
        console.error('Error creating announcement:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la création de l\'annonce',
            data: error instanceof Error ? error.message : String(error)
        });
    }
});
