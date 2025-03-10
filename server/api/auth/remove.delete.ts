import {createError, defineEventHandler, readBody} from 'h3'
import {deleteCookies} from "~/server/api/auth/logout.post";



export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();


    try {
        const removeResponse = await $fetch(`${config.private.api_base_url}/user/${body.uid}`, {
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