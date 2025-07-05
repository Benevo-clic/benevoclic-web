import {defineEventHandler} from "h3";
import axios from 'axios';




export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const { siretNum } = getQuery(event) as { siretNum?: string }
    if (!siretNum) {
        throw createError({
            statusCode: 400,
            message: 'SIRET number is required'
        });
    }

    try {

        const { data } = await axios.get(
            `${config.private.api_sirene_url}/${siretNum}`,
            {
                headers: {
                    'accept': 'application/json',
                    'X-INSEE-Api-Key-Integration': `${config.private.api_sirene_key}`,
                }
            }
        )
        return data
    } catch (error: any) {
        if (error.response?.status === 401) {
            throw createError({
                statusCode: 401,
                message: 'Token invalide'
            });
        }
        throw error;
    }
})