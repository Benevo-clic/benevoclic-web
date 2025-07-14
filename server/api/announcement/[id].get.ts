import axios from 'axios';
import { defineEventHandler } from 'h3';
import { Announcement } from '~/common/interface/event.interface';
import {ApiError} from "~/utils/ErrorHandler";

export default defineEventHandler(async (event) => {
  const announcementId = event.context.params?.id;
  const token = getCookie(event, 'auth_token');
  const config = useRuntimeConfig();

  if (!announcementId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Announcement ID is required',
    });
  }

  try {
    const response = await axios.get<Announcement>(
      `${config.private.api_base_url}/announcements/${announcementId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ApiError.handleAxios(error, 'Erreur lors de la récupération de l’annonce');
    }
  }
}); 