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
                message: 'Association ID is required'
            }
        });
    }


    try {
        const removeResponse = await $fetch(`${config.private.api_base_url}/api/v2/association/${query.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if(!removeResponse){
            throw new Error("Erreur lors de la suppression de l'utilisateur")
        }

        deleteCookies(event);

    }catch (error:any){
        throw new Error("Erreur lors de la suppression de l'utilisateur", error)
    }

})