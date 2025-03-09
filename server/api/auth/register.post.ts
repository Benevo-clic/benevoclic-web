import {createError, defineEventHandler, readBody} from 'h3'
import type {RegisterPayload, RegisterResponse} from "~/common/types/register.type";
import {LoginResponse} from "~/common/types/auth.type";
import {RegisterDone} from "~/common/interface/register.interface";




export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')
    const body = await readBody(event)
    const config = useRuntimeConfig();

    try {
        const registerResponse =  await $fetch<RegisterResponse>(`${config.private.api_base_url}/user/register`, {
            method: 'POST',
            body: {
                email: body.email,
                password: body.password,
                role: body.role
            } as RegisterPayload,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if(!registerResponse){
            throw createError({
                statusCode:404,
                message:"Erreur lors de l'inscription"
            })
        }

        const loginResponse = await $fetch<LoginResponse>(`${config.private.api_base_url}/user/login`, {
            method: 'POST',
            body: {
                email: body.email,
                password: body.password
            }
        })

        if(!!loginResponse.idToken){
            setCookie(event, 'auth_token', loginResponse.idToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7
            })

            setCookie(event, 'refresh_token', loginResponse.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 30
            })
            setCookie(event,'isConnected','true')
        }else {
            throw createError({
                statusCode: 401,
                message: 'Token manquant dans la réponse'
            })
        }

        return {
            loginResponse: loginResponse,
            registerResponse: {
                email: body.email,
                uid:registerResponse.uid
            }
        } as RegisterDone;
    }catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 401,
            message: error.message || "Échec de création de compte"
        })
    }

})