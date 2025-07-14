import type {VolunteerInfo} from "~/common/interface/volunteer.interface";
import axios from 'axios'
import { defineEventHandler, readBody } from "h3";



export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();



    try {

        const response = await axios.post<VolunteerInfo>(
            `${config.private.api_base_url}/volunteer`,
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
        return response.data;
    }catch (error: any) {
        console.error(`Error creating volunteer: ${error.message}`);
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: error.response?.statusText || 'Erreur serveur',
            data: {
                message: 'Failed to create volunteer',
                error: error.message
            }
        });

    }



});