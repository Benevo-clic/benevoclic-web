import { defineEventHandler } from 'h3';


export default defineEventHandler(async (event) => {
  const announcementId = event.context.params?.id;
  const token = getCookie(event, 'auth_token');
  const config = useRuntimeConfig();
  const body = await readBody(event);

  try {
    const response = await $fetch<boolean>(
      `${config.private.api_base_url}/announcements/${announcementId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body,
      }
    );
    return response.data;
  }catch (error) {
    console.error(`Error updating announcement ${announcementId}: ${error.message}`);
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.response?.statusText || 'Erreur serveur',
    });
  }
}); 