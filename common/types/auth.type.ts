import { RoleUser } from '~/common/enums/role.enum'

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  idToken: string
  refreshToken: string
  expiresIn: string
}

export type RegisterGooglePayload = {
  idToken: string
  role: RoleUser
}

export type RegisterUserGoogleResponse = {
  token: string
  expiresIn: number
}

export interface imageProfile {
  data: string
  contentType: string
  uploadedAt: string
}

export interface UserInfo {
  _id: string
  userId: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: RoleUser
  isOnline: boolean
  disabled: boolean
  isVerified: boolean
  lastConnection: string
  isCompleted?: boolean
  createdAt: string
  updatedAt: string
  imageProfile?: imageProfile
  avatarFileKey?: string
}
