import { RetryManager } from '~/utils/retry-manager'
import axios from 'axios'
import { defineEventHandler, readBody, getCookie } from 'h3'
import type { CreateAnnouncementDto } from '~/common/interface/event.interface'
import { ApiError } from '~/utils/error-handler'

export default defineEventHandler(async event => {
  const body = (await readBody(event)) as CreateAnnouncementDto
  const token = getCookie(event, 'auth_token')
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

  try {
    const form: CreateAnnouncementDto = {
      description: body.description,
      datePublication: body.datePublication,
      dateEvent: body.dateEvent,
      hoursEvent: body.hoursEvent,
      nameEvent: body.nameEvent,
      tags: body.tags,
      associationId: body.associationId,
      associationName: body.associationName,
      addressAnnouncement: body.addressAnnouncement,
      locationAnnouncement: body.locationAnnouncement,
      maxParticipants: body.maxParticipants,
      status: body.status,
      maxVolunteers: body.maxVolunteers
    }

    const url = `${apiBaseUrl}/announcements/createAnnouncement`

    const newAnnouncement = await RetryManager.post(
      url,
      {
        ...(form as CreateAnnouncementDto)
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        retry: {
          timeout: 10000,
          maxRetries: 3
        }
      }
    )

    return newAnnouncement.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      await ApiError.handleAxios(error, 'Erreur lors de la création de l’annonce')
    }
  }
})
