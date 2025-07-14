import type {VolunteerInfo} from "~/common/interface/volunteer.interface";
import axios from 'axios'
import { defineEventHandler, readBody } from "h3";
import {ApiError} from "~/utils/ErrorHandler";



export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();



    try {

        const response = await axios.post<VolunteerInfo>(
            `${config.private.api_base_url}/volunteer`,
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
            ApiError.handleAxios(error, 'Erreur lors de la création du volontaire');
        }
    }



});