import { defineEventHandler, readBody } from 'h3';
import { mockAnnouncements } from './_db';
import type { Announcement } from '~/common/interface/event.interface';

export default defineEventHandler(async (event) => {
  const announcementId = event.context.params?.id;
  const body = await readBody(event) as Partial<Announcement>;

  if (!announcementId) {
    throw createError({ statusCode: 400, statusMessage: 'ID manquant' });
  }

  const index = mockAnnouncements.findIndex((a) => a.id === announcementId);

  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Annonce non trouvée' });
  }

  // Update the announcement with the new data
  const updatedAnnouncement = { ...mockAnnouncements[index], ...body };
  mockAnnouncements[index] = updatedAnnouncement;
  
  console.log('Annonce mise à jour côté serveur:', updatedAnnouncement);

  return updatedAnnouncement;
}); 