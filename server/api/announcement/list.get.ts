import { defineEventHandler, getQuery } from 'h3';
import { EventStatus } from '~/common/enums/event.enum';
import { mockAnnouncements } from './_db';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const associationId = query.associationId as string | undefined;

  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (associationId) {
    return mockAnnouncements.filter(a => a.associationId === associationId);
  }

  // If no associationId, return all published announcements for a general view
  return mockAnnouncements.filter(a => a.status === EventStatus.PUBLISHED);
}); 