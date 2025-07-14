import type {CreateAnnouncementDto} from '~/common/interface/event.interface';
import axios from 'axios'
import {defineEventHandler, readBody, getCookie, createError, getQuery} from "h3";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();


    try {
        const url = `${config.private.api_base_url}/announcements/unregister/volunteerWaiting/${query.volunteerId}/${query.announcementId}`;
        const volunteerInfo = await axios.patch(url,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

        return volunteerInfo.data
    } catch (error) {
        console.error('Error creating announcement:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la création de l\'annonce',
            data: error instanceof Error ? error.message : String(error)
        });
    }
});
