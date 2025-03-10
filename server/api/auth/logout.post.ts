import {defineEventHandler, createError, deleteCookie, setCookie, H3Event, EventHandlerRequest} from 'h3'
import {EventHandlerList} from "mitt";


export function deleteCookies(event:H3Event<EventHandlerRequest>){
  deleteCookie(event, 'auth_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/'
  });

  deleteCookie(event, 'refresh_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/'
  });

  deleteCookie(event,'isConnected');
}

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();

  try {
    await $fetch(`${config.private.api_base_url}/user/logout`, {
      method: 'POST',
      headers: {
            'Authorization': `Bearer ${token}`
      }
    });

    deleteCookies(event);

    return {
      success: true,
      message: 'Déconnexion réussie'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.message || "Échec de la déconnexion"
    })
  }
})