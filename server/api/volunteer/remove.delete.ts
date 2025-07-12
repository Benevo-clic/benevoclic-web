import {defineEventHandler} from 'h3'
import {deleteCookies} from "~/server/api/auth/logout.post";



export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();
    const query = getQuery(event) as { id: string };
    if (!query.id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            data: {
                message: 'Volunteer ID is required'
            }
        });
    }


    try {
        const removeResponse = await $fetch(`${config.private.api_base_url}/volunteer/${query.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if(!removeResponse){
            throw new Error("Erreur lors de la suppression de l'utilisateur")
        }

        deleteCookies(event);

        return {
            message: 'Volunteer removed successfully',
            data: removeResponse
        }

    }catch (error:any){
        console.error(`Error removing volunteer: ${error.message}`);
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: error.response?.statusText || 'Erreur serveur',
            data: {
                message: 'Failed to remove volunteer',
                error: error.message
            }
        });
    }

})