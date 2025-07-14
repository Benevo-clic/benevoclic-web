import axios from 'axios'
import { defineEventHandler, readBody } from "h3";
import {AssociationInfo} from "~/common/interface/association.interface";
import {ApiError} from "~/utils/ErrorHandler";



export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();



    try {
        const response = await axios.post<AssociationInfo>(
            `${config.private.api_base_url}/api/v2/association`,
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
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de la création de l’association');
        }
    }
});