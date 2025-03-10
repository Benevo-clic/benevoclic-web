import { defineEventHandler, readBody, setCookie } from "h3";
import type { RegisterUserGoogleResponse } from "~/common/types/auth.type";


export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();
    if (!body || !body.idToken) {
        return { error: "Token manquant" };
    }

    const response: RegisterUserGoogleResponse = await $fetch<RegisterUserGoogleResponse>(`${config.private.api_base_url}/user/${body.uid}/update-connected/${true}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${body.idToken}`
        }
    });

    setCookie(event, 'isConnected', 'true');
    setCookie(event, 'auth_token', body.idToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 jours
    });
    setCookie(event, 'refresh_token', body.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30 // 30 jours
    });
    return response;
});