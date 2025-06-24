import axios from "axios";
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const announcementId = event.context.params?.id;
  const token = getCookie(event, 'auth_token');
  const config = useRuntimeConfig();

  try {
    const response = await axios.delete<boolean>(
        `${config.private.api_base_url}/announcements/${announcementId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );
    return response.data;
  }catch (error) {
    console.error(`Error deleting announcement ${announcementId}: ${error.message}`);
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.response?.statusText || 'Erreur serveur',
    });
  }

}); 