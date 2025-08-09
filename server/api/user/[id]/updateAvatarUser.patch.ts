// server/api/user/[id]/update-avatar.patch.ts
import { defineEventHandler, readMultipartFormData, getCookie, createError } from 'h3'
import axios from 'axios'
import FormData from 'form-data'
import type { UserInfo } from '~/common/types/auth.type'
import { ApiError } from '~/utils/ErrorHandler'

export default defineEventHandler(async event => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')

  // 1️⃣ Récupérer l’ID depuis le path param
  const { id } = event.context.params as { id?: string }
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID missing in path'
    })
  }

  // 2️⃣ Parser le multipart/form-data
  const parts = await readMultipartFormData(event)
  if (!parts || parts.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No multipart data received'
    })
  }

  // 3️⃣ Trouver la partie "file"
  const filePart = parts.find(p => p.name === 'file' && typeof (p as any).filename === 'string')
  if (!filePart) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Field "file" is required'
    })
  }

  // 4️⃣ Reconstituer un FormData pour Axios
  const { data, filename, mimeType } = filePart as {
    data: Buffer
    filename: string
    mimeType: string
  }
  const form = new FormData()
  form.append('file', data, { filename, contentType: mimeType })

  try {
    // 5️⃣ Proxy PATCH vers ton backend NestJS
    const url = `${config.private.api_base_url}/user/${id}/update-avatar`
    const { data: user } = await axios.patch<UserInfo>(url, form, {
      headers: {
        ...form.getHeaders(), // multipart/form-data; boundary=...
        Authorization: `Bearer ${token}` // remets le token si besoin
      }
    })
    return user
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la mise à jour de l’avatar')
    }
  }
})
