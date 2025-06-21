import type { Announcement } from '~/common/interface/event.interface';
import axios from 'axios'
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as Omit<Announcement, 'id'>;
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();

    try {

        const newAnnouncement =  await axios.post<Announcement>(
            `${config.private.api_base_url}/announcements`,
            {
                ...body,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            }
        )
        return newAnnouncement.data;
    }catch (error) {
        throw createError({ statusCode: 500, statusMessage: 'Erreur lors de la création de l\'annonce' });
    }
}); 