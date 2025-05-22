import axios from 'axios'
import { defineEventHandler, readBody } from "h3";
import {AssociationInfo} from "~/common/interface/association.interface";



export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();



    try {

        const response = await axios.post<AssociationInfo>(
            `${config.private.api_base_url}/association`,
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
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: error.response?.statusText || 'Erreur serveur'
        })
    }
});