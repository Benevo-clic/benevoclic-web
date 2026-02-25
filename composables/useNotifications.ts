import { ref, computed, onMounted, onUnmounted } from 'vue'
import { io, Socket } from 'socket.io-client'
import { useUser } from './auth/useUser'
import { useAssociationAuth } from './useAssociation'

export interface Notification {
    id: string
    recipientId: string
    recipientType: 'ASSOCIATION' | 'VOLUNTEER' | 'ADMIN'
    message: string
    redirectUrl?: string
    isRead: boolean
    type: string
    entityId?: string
    entityName?: string
    createdAt: string
}

export function useNotifications() {
    const notifications = ref<Notification[]>([])
    const unreadCount = ref(0)
    const isLoading = ref(false)
    const isConnected = ref(false)

    let socket: Socket | null = null

    const { user } = useUser()
    const { association } = useAssociationAuth()

    const recipientId = computed(() => {
        // Use associationId for associations, userId for volunteers/participants
        return association.value?.associationId || user.value?.userId
    })

    async function fetchNotifications() {
        if (!recipientId.value) return

        isLoading.value = true
        try {
            const response = await $fetch<Notification[]>('/api/notifications', {
                credentials: 'include'
            })
            notifications.value = response
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        } finally {
            isLoading.value = false
        }
    }

    async function fetchUnreadCount() {
        if (!recipientId.value) return

        try {
            const response = await $fetch<{ count: number }>('/api/notifications/unread-count', {
                credentials: 'include'
            })
            unreadCount.value = response.count
        } catch (error) {
            console.error('Failed to fetch unread count:', error)
        }
    }

    async function markAsRead(id: string) {
        try {
            await $fetch(`/api/notifications/${id}/read`, {
                method: 'PATCH',
                credentials: 'include'
            })
            const notification = notifications.value.find(n => n.id === id)
            if (notification) {
                notification.isRead = true
                unreadCount.value = Math.max(0, unreadCount.value - 1)
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error)
        }
    }

    async function markAllAsRead() {
        try {
            await $fetch('/api/notifications/mark-all-read', {
                method: 'PATCH',
                credentials: 'include'
            })
            notifications.value.forEach(n => n.isRead = true)
            unreadCount.value = 0
        } catch (error) {
            console.error('Failed to mark all as read:', error)
        }
    }

    async function deleteNotification(id: string) {
        try {
            await $fetch(`/api/notifications/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            const notification = notifications.value.find(n => n.id === id)
            if (notification && !notification.isRead) {
                unreadCount.value = Math.max(0, unreadCount.value - 1)
            }
            notifications.value = notifications.value.filter(n => n.id !== id)
        } catch (error) {
            console.error('Failed to delete notification:', error)
        }
    }

    function connectSocket() {
        if (!recipientId.value) return

        const config = useRuntimeConfig()
        const wsUrl = config.public.apiBaseUrl || 'http://localhost:3000'

        socket = io(`${wsUrl}/notifications`, {
            transports: ['websocket'],
            autoConnect: true,
        })

        socket.on('connect', () => {
            isConnected.value = true
            // Join room for this recipient
            socket?.emit('join', { recipientId: recipientId.value })
        })

        socket.on('disconnect', () => {
            isConnected.value = false
        })

        socket.on('notification', (notification: Notification) => {
            // Add new notification to the beginning of the list
            notifications.value.unshift(notification)
            unreadCount.value++
        })

        socket.on('unreadCount', (data: { count: number }) => {
            unreadCount.value = data.count
        })
    }

    function disconnectSocket() {
        if (socket) {
            socket.emit('leave', { recipientId: recipientId.value })
            socket.disconnect()
            socket = null
            isConnected.value = false
        }
    }

    function init() {
        fetchNotifications()
        fetchUnreadCount()
        connectSocket()
    }

    onMounted(() => {
        if (recipientId.value) {
            init()
        }
    })

    onUnmounted(() => {
        disconnectSocket()
    })

    return {
        notifications,
        unreadCount,
        isLoading,
        isConnected,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        init,
        disconnectSocket,
    }
}
