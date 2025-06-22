import axios from 'axios';
import { defineEventHandler } from 'h3';
import { Announcement } from '~/common/interface/event.interface';

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
    console.error(`Error fetching announcement ${announcementId}: ${error.message}`);
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.response?.statusText || 'Erreur serveur',
    });
  }
}); 