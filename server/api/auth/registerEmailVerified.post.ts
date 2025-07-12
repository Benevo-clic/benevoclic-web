import {createError, defineEventHandler, readBody} from 'h3'
import {login, setCookies} from "~/server/api/auth/login.post";
import {RegisterEmailVerifiedPayload} from "~/common/types/register.type";

interface RegisterResponse {
    uid: string
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const config = useRuntimeConfig();

    try {
        await $fetch<RegisterResponse>(`${config.private.api_base_url}/user/register-user-verified`, {
            method: 'POST',
            body: {
                email: body.email,
                role: body.role,
            } as RegisterEmailVerifiedPayload,
        });


        const loginResponse = await login({ email: body.email, password: body.password }, config.private.api_base_url);

        setCookies(event, loginResponse);

    }catch (error: any) {
        if( error.statusCode === 400 || error.statusCode === 401) {
            return
        }
        throw createError({
            statusCode: error.statusCode || 401,
            message: error.message || "Échec de création de compte"
        })
    }
})