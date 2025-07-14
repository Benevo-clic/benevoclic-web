import axios from 'axios'
import { defineEventHandler, readBody } from "h3";
import { getCookie, getQuery } from "h3";
import {ApiError} from "~/utils/ErrorHandler";
export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig()
    const { id } = getQuery(event) as { id?: string }
    const body = await readBody(event);
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            data: {
                message: 'Association ID is required'
            }
        });
    }

        try {

        const response = await axios.patch(
            `${config.private.api_base_url}/api/v2/association/${id}`,
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
            ApiError.handleAxios(error, 'Erreur lors de la mise à jour de l’association');
        }
    }
}
);