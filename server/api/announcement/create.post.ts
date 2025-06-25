import type {CreateAnnouncementDto} from '~/common/interface/event.interface';
import axios from 'axios'
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as CreateAnnouncementDto;
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig();


    try {
        const url = `${config.private.api_base_url}/announcements`;
        const form: CreateAnnouncementDto = {
            description: body.description,
            datePublication: body.datePublication,
            dateEvent: body.dateEvent,
            hoursEvent: body.hoursEvent,
            nameEvent: body.nameEvent,
            tags: body.tags,
            associationId: body.associationId,
            associationName: body.associationName,
            locationAnnouncement: body.locationAnnouncement,
            maxParticipants: body.maxParticipants,
            status: body.status,
            maxVolunteers: body.maxVolunteers
        }
        const newAnnouncement = await axios.post(url,
            {
                ...form as CreateAnnouncementDto,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });


        return newAnnouncement.data
    } catch (error) {
        console.error('Error creating announcement:', error);
        throw createError({ 
            statusCode: 500, 
            statusMessage: 'Erreur lors de la création de l\'annonce',
            data: error instanceof Error ? error.message : String(error)
        });
    }
}); 
