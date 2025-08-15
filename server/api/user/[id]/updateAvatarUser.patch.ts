// server/api/user/[id]/update-avatar.patch.ts
import { defineEventHandler, readMultipartFormData, getCookie, createError } from 'h3'
import { RetryManager } from '~/utils/retry-manager'
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
    const url = `${apiBaseUrl}/user/${id}/update-avatar`
    const { data: user } = await RetryManager.patch(url, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      },
      retry: {
        timeout: 10000, // 10 secondes
        maxRetries: 3 // 3 tentatives
      }
    })
    return user
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de la mise à jour de l’avatar')
    }
  }
})
