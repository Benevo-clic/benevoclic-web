import {defineEventHandler, createError, H3Event, EventHandlerRequest} from 'h3'
import {LoginResponse} from "~/common/types/auth.type";
import {getCookie, setCookie} from 'h3'
import axios from 'axios'
import {ApiError} from "~/utils/ErrorHandler";

function setAccessTokenOnly(event: H3Event<EventHandlerRequest>, loginResponse: LoginResponse) {
    if(loginResponse.idToken) {
        setCookie(event, 'auth_token', loginResponse.idToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 heures
        })
    }
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const refreshToken = getCookie(event, 'refresh_token')

    try {
        if(!refreshToken) {
            return
        }

        const loginResponse = await axios.post<LoginResponse>(`${config.private.api_base_url}/user/refresh`,
            {
                refreshToken
            },{
                headers: {
                    'Content-Type': 'application/json',
                }
            });

        setAccessTokenOnly(event, loginResponse.data);

        return loginResponse.data
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de la récupération de l’utilisateur actuel');
        }
    }
})