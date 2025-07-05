import {defineEventHandler, createError, H3Event, EventHandlerRequest} from 'h3'
import {LoginResponse} from "~/common/types/auth.type";
import {getCookie, setCookie} from 'h3'

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
      throw createError({
        statusCode: 401,
        message: "Refresh token manquant"
      })
    }

    const loginResponse = await $fetch<LoginResponse>(`${config.private.api_base_url}/user/refresh-auth?refreshToken=${refreshToken}`, {
      method: 'POST',
    })
    
    // Ne renouvelle que le token d'accès
    setAccessTokenOnly(event, loginResponse);
    
    return loginResponse
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.message || "Échec du rafraîchissement du token"
    })
  }
}) 