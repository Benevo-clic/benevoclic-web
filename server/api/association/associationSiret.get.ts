import {defineEventHandler} from "h3";
import axios from 'axios';
import {ApiError} from "~/utils/ErrorHandler";




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
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de la récupération des informations de l’association par SIRET');
        }
    }
})