import { defineEventHandler } from 'h3';
import { mockAnnouncements } from './_db';

export default defineEventHandler(async (event) => {
  const announcementId = event.context.params?.id;

  if (!announcementId) {
    throw createError({ statusCode: 400, statusMessage: 'ID manquant' });
  }

  const index = mockAnnouncements.findIndex((a) => a.id === announcementId);

  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Annonce non trouvée' });
  }

  mockAnnouncements.splice(index, 1);
  
  console.log('Annonce supprimée côté serveur:', announcementId);

  setResponseStatus(event, 204); // Set HTTP status to 204 No Content
  return;
}); 