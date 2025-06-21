import { defineEventHandler, readBody } from "h3";
import type { Announcement } from '~/common/interface/event.interface';
import { mockAnnouncements } from "./_db";

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as Omit<Announcement, 'id'>;

    const newAnnouncement: Announcement = {
        id: String(Math.random() * 1000000), // Create a random ID
        ...body,
    };

    mockAnnouncements.push(newAnnouncement);
    
    console.log('Annonce créée côté serveur:', newAnnouncement);

    setResponseStatus(event, 201); // Set HTTP status to 201 Created
    return newAnnouncement;
}); 