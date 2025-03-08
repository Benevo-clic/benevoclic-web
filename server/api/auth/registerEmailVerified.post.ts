import {createError, defineEventHandler, readBody} from 'h3'
import type {
    RegisterEmailVerifiedPayload,
} from "~/common/types/register.type";
import {LoginResponse} from "~/common/types/auth.type";

import {login} from "~/server/api/auth/login.post";

const API_BASE = process.env.API_BASE_URL

interface RegisterResponse {
    uid: string
}


const setAuthCookies = (event:any, tokens:LoginResponse) => {

    setCookie(event, 'auth_token', tokens.idToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7
    })

    setCookie(event, 'refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30
    })
    setCookie(event,'isConnected','true')
};

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log('Inscription de l\'utilisateur vérifié:', body);

    try {
        const registerEmailVerifiedResponse:RegisterResponse =  await $fetch<RegisterResponse>(`${API_BASE}/user/register-user-verified`, {
            method: 'POST',
            body: {
                email: body.email,
                role: body.role,
            } as RegisterEmailVerifiedPayload,
        });

        if(!registerEmailVerifiedResponse.uid){
            throw createError({
                statusCode:404,
                message:`Erreur lors de l'inscription de l'utilisateur vérifié ${body.email}`
            })
        }

        const response = await login({ email: body.email, password: body.password }, API_BASE);

        if (!response.idToken) {
            throw createError({ statusCode: 401, message: 'Token manquant dans la réponse' });
        }
        setAuthCookies(event, response);

        return {
            registerEmailVerifiedResponse: registerEmailVerifiedResponse
        };
    }catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 401,
            message: error.message || "Échec de création de compte"
        })
    }

})