import { defineEventHandler, readBody } from "h3";
import type {UserInfo} from "~/common/types/auth.type";
import axios from 'axios'
import {ApiError} from "~/utils/ErrorHandler";


export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();
    const token  = getCookie(event, 'auth_token')

    try {
        const response = await axios.patch<UserInfo>(`${config.private.api_base_url}/user/${body.id}/isCompleted/${body.isCompleted}`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })

        return response.data;

    }catch (error: any) {
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de la mise à jour du statut de complétion de l’utilisateur');
        }
    }

});