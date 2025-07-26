import {defineEventHandler, getQuery} from 'h3';
import { getCookie, readBody } from 'h3';
import axios from 'axios';
import {ApiError} from "~/utils/ErrorHandler";
import type {InfoVolunteer} from "~/common/interface/event.interface";


export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token');
    const config = useRuntimeConfig();
    const body = await readBody(event) as InfoVolunteer;
    const query = getQuery(event) as { announcementId: string };


    try {
        const response = await axios.patch(
            `${config.private.api_base_url}/announcements/present/volunteer/${query.announcementId}`,
            {
                ...body
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    }catch (error : any) {
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de la mise à jour de l’annonce');
        }
    }
});