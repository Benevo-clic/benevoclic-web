import type { AxiosError } from 'axios'
import { createError } from 'h3'
import { SessionCleaner } from './session-cleaner'

/**
 * Gestionnaire d'erreur centralisé pour l'application
 * Fournit une gestion cohérente des erreurs avec logs structurés
 */

export interface ErrorContext {
  endpoint?: string
  userId?: string
  action?: string
  requestId?: string
  timestamp?: string
}

export class ErrorHandler {
  private static errorCounts = new Map<string, number>()
  private static readonly MAX_ERRORS_PER_MINUTE = 10

  /**
   * Gère une erreur avec contexte et logging structuré
   */
  static handle(error: any, context: ErrorContext = {}): never {
    const errorInfo = this.extractErrorInfo(error, context)

    // Log structuré
    this.logError(errorInfo)

    // Métriques
    this.recordError(errorInfo)

    // Retour utilisateur approprié
    throw this.createUserFriendlyError(errorInfo)
  }

  /**
   * Gère spécifiquement les erreurs Axios
   */
  static async handleAxios(
    err: AxiosError,
    userMessage = "Erreur lors de l'appel à l'API",
    context: ErrorContext = {}
  ): Promise<never> {
    const errorInfo = this.extractAxiosErrorInfo(err, userMessage, context)

    // Log structuré
    this.logError(errorInfo)

    // Métriques
    this.recordError(errorInfo)

    // Vérifier si une déconnexion forcée est nécessaire
    if (this.shouldForceLogout(err, context)) {
      await SessionCleaner.forceLogout(this.getLogoutReason(err))
    }

    // Retour utilisateur approprié
    throw this.createAxiosErrorResponse(errorInfo)
  }

  /**
   * Extrait les informations d'erreur
   */
  private static extractErrorInfo(error: any, context: ErrorContext) {
    return {
      message: error?.message || 'Erreur inconnue',
      stack: error?.stack,
      code: error?.code || error?.status || 'UNKNOWN',
      status: error?.status || 500,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        requestId: context.requestId || this.generateRequestId()
      },
      originalError: error
    }
  }

  /**
   * Extrait les informations d'erreur Axios
   */
  private static extractAxiosErrorInfo(
    err: AxiosError,
    userMessage: string,
    context: ErrorContext
  ) {
    const status = err.response?.status || 502
    const statusText = err.response?.statusText || 'Bad Gateway'
    const data = err.response?.data

    return {
      message: userMessage,
      stack: err.stack,
      code: err.code || 'NETWORK_ERROR',
      status,
      statusText,
      data,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        requestId: context.requestId || this.generateRequestId(),
        url: err.config?.url,
        method: err.config?.method
      },
      originalError: err
    }
  }

  /**
   * Log structuré des erreurs
   */
  private static logError(errorInfo: any) {
    const logEntry = {
      timestamp: errorInfo.context.timestamp,
      level: 'ERROR',
      message: errorInfo.message,
      code: errorInfo.code,
      status: errorInfo.status,
      context: errorInfo.context,
      stack: errorInfo.stack
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 ERREUR:', logEntry)
    } else {
      console.error(JSON.stringify(logEntry))
    }
  }

  private static recordError(errorInfo: any) {
    const errorKey = `${errorInfo.code}:${errorInfo.status}`
    const currentCount = this.errorCounts.get(errorKey) || 0
    this.errorCounts.set(errorKey, currentCount + 1)

    if (currentCount + 1 >= this.MAX_ERRORS_PER_MINUTE) {
      console.warn(`⚠️ Trop d'erreurs ${errorKey}: ${currentCount + 1} en 1 minute`)
    }
  }

  private static createUserFriendlyError(errorInfo: any) {
    const statusCode = errorInfo.status || 500

    return createError({
      statusCode,
      statusMessage: this.getStatusMessage(statusCode),
      data: {
        message: this.getUserFriendlyMessage(errorInfo),
        errorId: errorInfo.context.requestId,
        timestamp: errorInfo.context.timestamp
      }
    })
  }

  private static createAxiosErrorResponse(errorInfo: any) {
    if (errorInfo.status && errorInfo.status >= 400 && errorInfo.status < 600) {
      return createError({
        statusCode: errorInfo.status,
        statusMessage: errorInfo.statusText,
        data: {
          message: errorInfo.message,
          details: errorInfo.data,
          errorId: errorInfo.context.requestId,
          timestamp: errorInfo.context.timestamp
        }
      })
    }

    return createError({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      data: {
        message: errorInfo.message,
        details: errorInfo.originalError.message,
        errorId: errorInfo.context.requestId,
        timestamp: errorInfo.context.timestamp
      }
    })
  }

  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private static getStatusMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Timeout'
    }
    return messages[status] || 'Unknown Error'
  }

  private static getUserFriendlyMessage(errorInfo: any): string {
    const { code, status } = errorInfo

    const messages: Record<string, string> = {
      NETWORK_ERROR: 'Problème de connexion réseau',
      TIMEOUT: 'La requête a pris trop de temps',
      CONFIG_ERROR: 'Erreur de configuration',
      AUTH_ERROR: "Erreur d'authentification",
      VALIDATION_ERROR: 'Données invalides',
      DATABASE_ERROR: 'Erreur de base de données',
      EXTERNAL_API_ERROR: 'Erreur du service externe'
    }

    const statusMessages: Record<number, string> = {
      400: 'Requête invalide',
      401: 'Authentification requise',
      403: 'Accès refusé',
      404: 'Ressource non trouvée',
      500: 'Erreur interne du serveur',
      502: 'Service temporairement indisponible',
      503: 'Service en maintenance',
      504: 'Service temporairement indisponible'
    }

    return messages[code] || statusMessages[status] || "Une erreur inattendue s'est produite"
  }

  static clearErrorCounts(): void {
    this.errorCounts.clear()
  }

  static getErrorStats(): Record<string, number> {
    return Object.fromEntries(this.errorCounts)
  }

  /**
   * Détermine si une déconnexion forcée est nécessaire
   */
  private static shouldForceLogout(err: AxiosError, context: ErrorContext): boolean {
    // Déconnexion forcée pour les erreurs d'authentification
    if (err.response?.status === 401 || err.response?.status === 403) {
      return true
    }

    // Déconnexion forcée pour les erreurs de session
    if (err.response?.status === 440 || err.response?.status === 419) {
      return true
    }

    // Déconnexion forcée pour les endpoints critiques d'authentification
    const criticalEndpoints = ['current-user', 'auth', 'login', 'refresh']
    if (context.endpoint && criticalEndpoints.some(ep => context.endpoint?.includes(ep))) {
      return (err.response?.status || 0) >= 500 || !err.response
    }

    return false
  }

  /**
   * Retourne la raison de déconnexion basée sur l'erreur
   */
  private static getLogoutReason(err: AxiosError): string {
    if (err.response?.status === 401) {
      return 'auth_failed'
    }

    if (err.response?.status === 403) {
      return 'auth_failed'
    }

    if (err.response?.status === 440 || err.response?.status === 419) {
      return 'session_expired'
    }

    if ((err.response?.status || 0) >= 500) {
      return 'server_error'
    }

    if (!err.response) {
      return 'network_error'
    }

    return 'session_expired'
  }
}

export class ApiError {
  public static async handleAxios(
    err: AxiosError,
    userMessage = "Erreur lors de l'appel à l'API"
  ): Promise<never> {
    return ErrorHandler.handleAxios(err, userMessage)
  }
}
