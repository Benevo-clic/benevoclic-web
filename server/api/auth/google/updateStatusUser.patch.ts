import { defineEventHandler, readBody } from "h3";
import type { RegisterUserGoogleResponse } from "~/common/types/auth.type";
import {setCookies} from "~/server/api/auth/login.post";


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
        },
    });

    setCookies(event,{
        idUser: body.uid,
        idToken: body.idToken,
        refreshToken: body.refreshToken
    });

    return response;
});