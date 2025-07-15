import {defineEventHandler} from 'h3'
import {deleteCookies} from "~/server/api/auth/logout.post";
import axios from 'axios'
import {ApiError} from "~/utils/ErrorHandler";



export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();
    const query = getQuery(event) as { id: string };
    if (!query.id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            data: {
                message: 'Association ID is required'
            }
        });
    }

    try {
       await axios.delete(`${config.private.api_base_url}/api/v2/association/${query.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        deleteCookies(event);

    }catch (error:any){
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de la suppression de l’association');
        }
    }

})