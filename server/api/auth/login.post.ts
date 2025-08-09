import {defineEventHandler, readBody, createError, H3Event, EventHandlerRequest} from 'h3'
import axios from "axios";
import {setCookie} from 'h3'
import {ApiError} from "~/utils/ErrorHandler";

export interface LoginResponse {
    idUser: string
    idToken: string
    refreshToken: string
    expiresIn?: string
}

export function setCookies(event:H3Event<EventHandlerRequest>,loginResponse: LoginResponse){

  if(loginResponse.idToken){
    setCookie(event, 'auth_token', loginResponse.idToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 heures
    })

    setCookie(event, 'id_user', loginResponse.idUser, {
      httpOnly: false,
        secure: false,
        sameSite: 'none',
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 jours
    })

    setCookie(event, 'refresh_token', loginResponse.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 jours
    })
    setCookie(event,'isConnected','true',{
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 jours
    })

  }else{
    throw createError({
      statusCode: 401,
      message: 'Token manquant dans la réponse'
    })
  }
}

export async function login(payload: { email: string, password: string },apiBase:string | undefined): Promise<LoginResponse> {

  const response  = await axios.post<LoginResponse>(`${apiBase}/user/login`, {
    email: payload.email,
    password: payload.password
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  })

  return response.data
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig();


  try {

    const loginResponse = await login({
        email: body.email,
        password: body.password,
    },config.private.api_base_url)
    setCookies(event,loginResponse)
    return loginResponse
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la connexion');
    }
  }
}) 