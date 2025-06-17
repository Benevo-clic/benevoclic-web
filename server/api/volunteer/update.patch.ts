import axios from 'axios'
import { defineEventHandler, readBody } from "h3";




export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig()
    const { id } = getQuery(event) as { id?: string }
    const body = await readBody(event);



        try {

        const response = await axios.patch(
            `${config.private.api_base_url}/volunteer/${id}`,
            {
                ...body,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            }
        )
        return response.data;

    }catch (error) {

    }
}
);