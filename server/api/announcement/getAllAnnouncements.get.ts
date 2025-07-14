import { defineEventHandler, getQuery } from 'h3';
import axios from 'axios'
import {Announcement} from "~/common/interface/event.interface";


export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    try {

        const response = await axios.get<Announcement>(`${config.private.api_base_url}/announcements`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        return response.data;
    }catch (error) {
        console.error('Error fetching announcements:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la récupération des annonces',
            data: error instanceof Error ? error.message : String(error)
        });
    }


});