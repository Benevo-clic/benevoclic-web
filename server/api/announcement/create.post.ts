import type {CreateAnnouncementDto} from '~/common/interface/event.interface';
import axios from 'axios'
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as CreateAnnouncementDto;
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();


    try {
        const url = `${config.private.api_base_url}/announcements`;

        const newAnnouncement = await axios.post(url,
            {
                ...body,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

        console.log('New announcement created:', newAnnouncement.data);

        return newAnnouncement.data
    } catch (error) {
        console.error('Error creating announcement:', error);
        throw createError({ 
            statusCode: 500, 
            statusMessage: 'Erreur lors de la création de l\'annonce',
            data: error instanceof Error ? error.message : String(error)
        });
    }
}); 
