import { defineEventHandler, readBody, setCookie } from "h3";
import { RoleUser } from "~/common/enums/role.enum";
import type { RegisterGooglePayload, RegisterUserGoogleResponse } from "~/common/types/auth.type";
import { getAuth, signInWithCustomToken } from "@firebase/auth";
import {setCookies} from "~/server/api/auth/login.post";

const API_BASE = process.env.API_BASE_URL;

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    // Vérification que le body contient l'idToken
    if (!body || !body.idToken) {
        return { error: "Token manquant" };
    }

    const response: RegisterUserGoogleResponse = await $fetch<RegisterUserGoogleResponse>(`${config.private.api_base_url}/user/register-google`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            idToken: body.idToken,
            role: body.role,
        } as RegisterGooglePayload,
    });

    if (!response.token) {
        return { error: "Invalid token" };
    }

    const auth = getAuth();

    try {
        const userCredential = await signInWithCustomToken(auth, response.token);

        const idToken = await userCredential.user.getIdToken();
        const refreshToken = userCredential.user.refreshToken;

        setCookies(event,{
            idToken,
            refreshToken
        })

        return {
            idToken,
            refreshToken
        };
    } catch (error) {
        console.error("Erreur d'authentification:", error);
        return { error: "Erreur d'authentification" };
    }
});