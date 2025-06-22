import axios from 'axios'
import { defineEventHandler, readBody } from "h3";




export default defineEventHandler(async (event) => {
    const token  = getCookie(event, 'auth_token')
    const config = useRuntimeConfig()
    const body   = await readBody<{ id: string; imageBase64: string }>(event)

    if (!body.id || !body.imageBase64) {
        throw createError({ statusCode: 400, statusMessage: 'Paramètres manquants' })
    }

    // Convertir Base64 en Blob
    function base64toBlob(base64: string) {
        const [meta, data] = base64.split(',')
        const mime = meta.match(/data:(.*);base64/)![1]
        const bin  = atob(data)
        const len  = bin.length
        const arr  = new Uint8Array(len)
        for (let i = 0; i < len; i++) arr[i] = bin.charCodeAt(i)
        return new Blob([arr], { type: mime })
    }

    try {
        const form = new FormData()
        form.append('image', base64toBlob(body.imageBase64), 'profile.png')

        const response = await axios.patch(
            `${config.private.api_base_url}/announcements/cover-announcement/${body.id}`,
            form,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization:  `Bearer ${token}`
                }
            }
        )
        return response.data
    } catch (err: any) {
        throw createError({
            statusCode:    err.response?.status  ?? 500,
            statusMessage: err.response?.statusText ?? 'Erreur serveur'
        })
    }
})