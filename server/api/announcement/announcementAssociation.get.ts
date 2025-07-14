import { defineEventHandler, getQuery } from 'h3';
import axios from 'axios'
import {Announcement} from "~/common/interface/event.interface";


export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const associationId = query.associationId as string | undefined;
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig();
    if (!associationId) {
        throw createError({
        statusCode: 400,
        statusMessage: 'Association ID is required',
        });
    }

  try {

    const response = await axios.get<Announcement>(`${config.private.api_base_url}/announcements/association/${associationId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

    return response.data;
  }catch (error) {
    console.error('Error fetching announcements:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des annonces',
      data: error instanceof Error ? error.message : String(error)
    });
  }


}); 