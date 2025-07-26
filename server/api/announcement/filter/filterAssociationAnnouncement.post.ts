import { defineEventHandler } from 'h3';
import axios from 'axios'
import {ApiError} from "~/utils/ErrorHandler";
import {
    FilterAnnouncement,
    FilterAnnouncementResponse,
    type FilterAssociationAnnouncement
} from "~/common/interface/filter.interface";


export default defineEventHandler(async (event) => {

    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();
    const body = await readBody(event) as FilterAssociationAnnouncement;

    try {
        const payload: any = {
            ...body,
        } as FilterAssociationAnnouncement;
        if (Array.isArray(payload.tags) && payload.tags.length === 0) {
            delete payload.tags;
        }
        const response = await axios.post<FilterAnnouncementResponse>(`${config.private.api_base_url}/announcements/filter/association`,
            {
                ...payload
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

        return response.data;
    }catch (error) {
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de la récupération des annonces par association');
        }
    }


});