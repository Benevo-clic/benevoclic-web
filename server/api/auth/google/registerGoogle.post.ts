import { defineEventHandler, readBody, setCookie } from "h3";
import { RoleUser } from "~/common/enums/role.enum";
import type { RegisterGooglePayload, RegisterUserGoogleResponse } from "~/common/types/auth.type";
import { getAuth, signInWithCustomToken } from "@firebase/auth";

const API_BASE = process.env.API_BASE_URL;

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    // Vérification que le body contient l'idToken
    if (!body || !body.idToken) {
        return { error: "Token manquant" };
    }

    // Appel à l'API pour enregistrer l'utilisateur
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

    // Vérification de la réponse de l'API
    if (!response.token) {
        return { error: "Invalid token" };
    }

    const auth = getAuth();

    try {
        const userCredential = await signInWithCustomToken(auth, response.token);

        const idToken = await userCredential.user.getIdToken();
        const refreshToken = userCredential.user.refreshToken;

        if (idToken !== null) {
            setCookie(event, 'isConnected', 'true');
            setCookie(event, 'auth_token', idToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 // 7 jours
            });
            setCookie(event, 'refresh_token', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 30 // 30 jours
            });
        }

        // Retourner les tokens
        return {
            idToken,
            refreshToken
        };
    } catch (error) {
        console.error("Erreur d'authentification:", error);
        return { error: "Erreur d'authentification" };
    }
});