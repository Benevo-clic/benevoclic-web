export interface User {
    _id: string
    userId: string
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
    role: 'VOLUNTEER' | 'ADMIN' | 'USER'
    isOnline: boolean
    disabled: boolean
    isVerified: boolean
    lastConnection: string
    createdAt: string
    updatedAt: string
}