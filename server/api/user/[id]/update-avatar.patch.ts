import {
  defineEventHandler,
  readBody,
  createError,
  getCookie,
  readMultipartFormData
} from 'h3'
import axios from 'axios'
import FormData from 'form-data'
import { ApiError } from '~/utils/ErrorHandler'
import type { UserInfo } from '~/common/types/auth.type'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
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

  const filePart = parts.find(
    p => p.name === 'file' && typeof (p as any).filename === 'string'
  )
  if (!filePart) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Field "file" is required'
    })
  }

  const { data, filename, mimeType } = filePart as {
    data: Buffer;
    filename: string;
    mimeType: string;
  }
  const form = new FormData()
  form.append('file', data, { filename, contentType: mimeType })

  try {
    const url = `${config.private.api_base_url}/user/${id}/update-avatar`
    const { data: user } = await axios.patch<UserInfo>(url, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    })
    return user
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la mise à jour de l’avatar')
    }
  }
})
