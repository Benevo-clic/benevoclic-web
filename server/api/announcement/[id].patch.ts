import { defineEventHandler } from 'h3';
import { getCookie, readBody } from 'h3';
import axios from 'axios';


export default defineEventHandler(async (event) => {
  const announcementId = event.context.params?.id;
  const token = getCookie(event, 'auth_token');
  const config = useRuntimeConfig();
  const body = await readBody(event);

  try {
    const response = await axios.patch(
      `${config.private.api_base_url}/announcements/${announcementId}`,
        {
            ...body,
        },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }catch (error : any) {
    console.error(`Error updating announcement ${announcementId}: ${error.message}`);
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.response?.statusText || 'Erreur serveur',
      data: error instanceof Error ? error.message : String(error)
    });
  }
}); 