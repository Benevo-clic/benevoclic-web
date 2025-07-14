import { defineEventHandler, readBody } from "h3";
import type { RegisterGooglePayload, RegisterUserGoogleResponse } from "~/common/types/auth.type";
import { getAuth, signInWithCustomToken } from "@firebase/auth";
import {setCookies} from "~/server/api/auth/login.post";
import axios from "axios";
import {ApiError} from "~/utils/ErrorHandler";


export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    if (!body || !body.idToken) {
        return { error: "Token manquant" };
    }

    const response = await axios.post<RegisterUserGoogleResponse>(`${config.private.api_base_url}/user/register-google`,
        {
            idToken: body.idToken,
            role: body.role,
        } as RegisterGooglePayload,
        {
        headers: {
            "Content-Type": "application/json"
        },
    });


    if (!response.data.token) {
        return { error: "Invalid token" };
    }

    const auth = getAuth();

    try {
        const userCredential = await signInWithCustomToken(auth, response.data.token);

        const idToken = await userCredential.user.getIdToken();
        const refreshToken = userCredential.user.refreshToken;

        setCookies(event,{
            idUser: userCredential.user.uid,
            idToken,
            refreshToken
        })

        return {
            idToken,
            refreshToken
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            ApiError.handleAxios(error, 'Erreur lors de l’authentification avec Google');
        }
    }
});