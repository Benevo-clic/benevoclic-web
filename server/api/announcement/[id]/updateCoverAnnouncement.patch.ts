// server/api/user/[id]/update-avatar.patch.ts
import {
    defineEventHandler,
    readMultipartFormData,
    getCookie,
    createError
} from 'h3'
import axios from 'axios'
import FormData from 'form-data'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const token  = getCookie(event, 'auth_token')

    // 1️⃣ Récupérer l’ID depuis le path param
    const { id } = event.context.params as { id?: string }
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'User ID missing in path' })
    }

    const parts = await readMultipartFormData(event)
    if (!parts || parts.length === 0) {
        throw createError({ statusCode: 400, statusMessage: 'No multipart data received' })
    }

    const filePart = parts.find(p => p.name === 'file' && typeof (p as any).filename === 'string')
    if (!filePart) {
        throw createError({ statusCode: 400, statusMessage: 'Field "file" is required' })
    }

    const { data, filename, mimeType } = filePart as { data: Buffer; filename: string; mimeType: string }
    const form = new FormData()
    form.append('file', data, { filename, contentType: mimeType })

    try {
        // 5️⃣ Proxy PATCH vers ton backend NestJS
        const url = `${config.private.api_base_url}/announcements/cover-announcement/${id}`

        const {data: announcement} = await axios.patch(
            url,
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        return announcement
    } catch (err: any) {
        console.error('Error updating avatar:', err.response?.data || err.message)
        throw createError({
            statusCode:    err.response?.status   || 500,
            statusMessage: err.response?.statusText || 'Server Error',
            data: {
                message: 'Failed to update avatar',
                error:   err.response?.data || err.message,
            },
        })
    }
})
