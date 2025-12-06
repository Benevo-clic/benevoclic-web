import { defineEventHandler, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const apiBaseUrl = config.apiBaseUrl || 'http://localhost:3000'
    const authToken = getCookie(event, 'auth_token')

    if (!authToken) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    try {
        const response = await $fetch<{ count: number }>(`${apiBaseUrl}/notifications/unread-count`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        })

        return response
    } catch (error: any) {
        throw createError({
            statusCode: error?.statusCode || 500,
            message: error?.message || 'Failed to fetch unread count'
        })
    }
})
