import axios from 'axios'
import {defineEventHandler, readBody} from "h3";
import type { FavoritesAnnouncement } from "~/common/interface/event.interface";

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as FavoritesAnnouncement;
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();

    try {
        const url = `${config.private.api_base_url}/favorites-announcement`;
        const response = await axios.post(url,
            body,
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
