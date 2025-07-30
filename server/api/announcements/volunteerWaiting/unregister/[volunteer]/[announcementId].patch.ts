import axios from 'axios'
import {defineEventHandler, readBody, getCookie} from "h3";
import {ApiError} from "~/utils/ErrorHandler";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();

    const announcementId = getRouterParam(event, 'announcementId')
    const volunteer = getRouterParam(event, 'volunteer')



    try {
        const url = `${config.private.api_base_url}/announcements/volunteerWaiting/unregister/${volunteer}/${announcementId}`;

        const volunteerInfo = await axios.patch(url,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
        return volunteerInfo.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de la suppression du volunteer');
        }
    }
});
