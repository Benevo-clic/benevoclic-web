// server/api/user/[id]/update-avatar.patch.ts
import { defineEventHandler, readMultipartFormData, getCookie, createError } from 'h3'
import axios from 'axios'
import FormData from 'form-data'
import { ApiError } from '~/utils/error-handler'

export default defineEventHandler(async event => {
  const apiBaseUrl = process.env.API_BASE_URL
  if (!apiBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration Error',
      data: {
        message: 'API_BASE_URL is not configured',
        details: 'Please check your environment variables'
      }
    })
  }
  const token = getCookie(event, 'auth_token')
  const announcementId = event.context.params?.id
  if (!announcementId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Announcement ID is required'
    })
  }

  // 1️⃣ Récupérer l’ID depuis le path param
  const { id } = event.context.params as { id?: string }
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID missing in path'
    })
  }

  const parts = await readMultipartFormData(event)
  if (!parts || parts.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No multipart data received'
    })
  }

  const filePart = parts.find(p => p.name === 'file' && typeof (p as any).filename === 'string')
  if (!filePart) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Field "file" is required'
    })
  }

  const { data, filename, mimeType } = filePart as {
    data: Buffer
    filename: string
    mimeType: string
  }
  const form = new FormData()
  form.append('file', data, { filename, contentType: mimeType })

  try {
    // 5️⃣ Proxy PATCH vers ton backend NestJS
    const url = `${apiBaseUrl}/announcements/coverAnnouncement/${announcementId}`

    const { data: announcement } = await axios.patch(url, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      },
      timeout: 5000
    })
    return announcement
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de la mise à jour de l’avatar de l’annonce')
    }
  }
})
