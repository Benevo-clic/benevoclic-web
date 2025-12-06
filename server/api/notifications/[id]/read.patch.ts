import { defineEventHandler, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const apiBaseUrl = config.apiBaseUrl || 'http://localhost:3000'
    const authToken = getCookie(event, 'auth_token')
    const notificationId = event.context.params?.id

    if (!authToken) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    if (!notificationId) {
        throw createError({
            statusCode: 400,
            message: 'Notification ID required'
        })
    }

    try {
        const response = await $fetch(`${apiBaseUrl}/notifications/${notificationId}/read`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        })

        return response
    } catch (error: any) {
        throw createError({
            statusCode: error?.statusCode || 500,
            message: error?.message || 'Failed to mark notification as read'
        })
    }
})
