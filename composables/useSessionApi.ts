import { $fetch } from 'ofetch'

export interface SessionInfo {
  isValid: boolean
  user: {
    uid: string
    role: string
    email: string
    emailVerified: boolean
  }
  expiresAt: number
  issuedAt: number
  lastActivity: number
}

export interface SessionRefreshResponse {
  success: boolean
  message: string
  user: {
    uid: string
    role: string
    email: string
  }
}

export const useSessionApi = () => {
  // Vérifier la session
  const verifySession = async (): Promise<SessionInfo> => {
    try {
      return await $fetch<SessionInfo>('/api/auth/session', {
        method: 'GET',
        credentials: 'include'
      })
    } catch (error: any) {
      process.env.NODE_ENV !== 'production' &&
        console.error('❌ Erreur lors de la vérification de session:', error)
      throw error
    }
  }

  // Rafraîchir la session
  const refreshSession = async (): Promise<SessionRefreshResponse> => {
    try {
      return await $fetch<SessionRefreshResponse>('/api/auth/session/refresh', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error: any) {
      process.env.NODE_ENV !== 'production' &&
        console.error('❌ Erreur lors du rafraîchissement de session:', error)
      throw error
    }
  }

  // Vérifier si la session est valide
  const isSessionValid = async (): Promise<boolean> => {
    try {
      const sessionInfo = await verifySession()
      return sessionInfo.isValid && sessionInfo.expiresAt > Date.now()
    } catch (error) {
      return false
    }
  }

  return {
    verifySession,
    refreshSession,
    isSessionValid
  }
}
