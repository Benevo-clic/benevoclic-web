import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { ErrorHandler } from './error-handler'
import { SessionCleaner } from './session-cleaner'

export interface RetryConfig {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  timeout?: number
  retryCondition?: (error: any) => boolean
  onRetry?: (attempt: number, error: any) => void
}

export interface RequestConfig extends AxiosRequestConfig {
  retry?: RetryConfig
}

export class RetryManager {
  private static defaultConfig: RetryConfig = {
    maxRetries: 5,
    baseDelay: 2000,
    maxDelay: 10000,
    timeout: 10000,
    retryCondition: (error: any) => {
      return (
        !error.response ||
        (error.response.status >= 500 && error.response.status < 600) ||
        error.code === 'ECONNABORTED' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ENOTFOUND'
      )
    }
  }

  static async request<T = any>(
    config: RequestConfig,
    context?: { endpoint?: string; userId?: string; action?: string }
  ): Promise<AxiosResponse<T>> {
    const retryConfig = { ...this.defaultConfig, ...config.retry }
    const requestId = this.generateRequestId()
    const startTime = Date.now()

    for (let attempt = 0; attempt <= retryConfig.maxRetries!; attempt++) {
      const requestConfig: AxiosRequestConfig = {
        ...config,
        timeout: Math.max(1000, retryConfig.timeout! / (retryConfig.maxRetries! + 1)),
        headers: {
          'X-Request-ID': requestId,
          'X-Attempt': attempt.toString(),
          ...config.headers
        }
      }

      try {
        // this.logSuccess(requestConfig, response, attempt, requestId)

        return await axios.request<T>(requestConfig)
      } catch (error: any) {
        const isLastAttempt = attempt === retryConfig.maxRetries!
        const elapsedTime = Date.now() - startTime
        const isTimeoutReached = elapsedTime >= retryConfig.timeout!

        this.logError(requestConfig, error, attempt, requestId, context)

        if (isLastAttempt || isTimeoutReached || !retryConfig.retryCondition!(error)) {
          const shouldLogout = this.shouldForceLogout(error, context)

          if (shouldLogout) {
            await SessionCleaner.forceLogout(this.getLogoutReason(error))
          }

          await ErrorHandler.handleAxios(error, this.getErrorMessage(error, attempt, elapsedTime), {
            ...context,
            requestId
          })
        }

        if (retryConfig.onRetry) {
          retryConfig.onRetry(attempt, error)
        }

        if (!isLastAttempt && !isTimeoutReached) {
          const delay = this.calculateDelay(attempt, retryConfig)
          await this.sleep(delay)
        }
      }
    }

    throw new Error('Toutes les tentatives ont échoué')
  }

  static async get<T = any>(
    url: string,
    config?: RequestConfig,
    context?: { endpoint?: string; userId?: string; action?: string }
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url }, context)
  }

  static async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
    context?: { endpoint?: string; userId?: string; action?: string }
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data }, context)
  }

  static async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
    context?: { endpoint?: string; userId?: string; action?: string }
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data }, context)
  }

  static async delete<T = any>(
    url: string,
    config?: RequestConfig,
    context?: { endpoint?: string; userId?: string; action?: string }
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url }, context)
  }

  static async patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
    context?: { endpoint?: string; userId?: string; action?: string }
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data }, context)
  }

  private static calculateDelay(attempt: number, config: RetryConfig): number {
    const delay = config.baseDelay! * Math.pow(2, attempt)

    const totalTimeElapsed = attempt * config.baseDelay!
    const remainingTime = config.timeout! - totalTimeElapsed

    if (remainingTime < delay) {
      return Math.max(remainingTime, 100)
    }

    return Math.min(delay, config.maxDelay!)
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private static logSuccess(
    config: AxiosRequestConfig,
    response: AxiosResponse,
    attempt: number,
    requestId: string
  ) {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `✅ ${config.method?.toUpperCase()} ${config.url} - Tentative ${attempt + 1} - ${response.status}`
      )
    }
  }

  private static logError(
    config: AxiosRequestConfig,
    error: any,
    attempt: number,
    requestId: string,
    context?: { endpoint?: string; userId?: string; action?: string }
  ) {
    const isLastAttempt = attempt === 5
    const logLevel = isLastAttempt ? 'error' : 'warn'

    const logData = {
      timestamp: new Date().toISOString(),
      level: logLevel.toUpperCase(),
      requestId,
      method: config.method?.toUpperCase(),
      url: config.url,
      attempt: attempt + 1,
      error: error.message,
      status: error.response?.status,
      context
    }

    if (process.env.NODE_ENV === 'development') {
      console[logLevel](
        `${isLastAttempt ? '❌' : '⚠️'} ${config.method?.toUpperCase()} ${config.url} - Tentative ${attempt + 1}/5 - ${error.message}`
      )
    } else {
      console[logLevel](JSON.stringify(logData))
    }
  }

  private static getErrorMessage(error: any, attempt: number, elapsedTime?: number): string {
    if (attempt === 0) {
      return "Erreur lors de l'appel à l'API"
    }

    const timeInfo = elapsedTime ? ` (${Math.round(elapsedTime / 1000)}s)` : ''
    return `Erreur après ${attempt + 1} tentatives${timeInfo}`
  }

  static setDefaultConfig(config: Partial<RetryConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config }
  }

  static getDefaultConfig(): RetryConfig {
    return { ...this.defaultConfig }
  }

  private static shouldForceLogout(
    error: any,
    context?: { endpoint?: string; userId?: string; action?: string }
  ): boolean {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return true
    }

    if (error.response?.status === 440 || error.response?.status === 419) {
      return true
    }

    const criticalEndpoints = ['current-user', 'auth', 'login', 'refresh']
    if (context?.endpoint && criticalEndpoints.some(ep => context.endpoint?.includes(ep))) {
      return error.response?.status >= 500 || !error.response
    }

    return false
  }

  private static getLogoutReason(error: any): string {
    if (error.response?.status === 401) {
      return 'auth_failed'
    }

    if (error.response?.status === 403) {
      return 'auth_failed'
    }

    if (error.response?.status === 440 || error.response?.status === 419) {
      return 'session_expired'
    }

    if (error.response?.status >= 500) {
      return 'server_error'
    }

    if (!error.response) {
      return 'network_error'
    }

    return 'session_expired'
  }

  static isAxiosError(error: any): boolean {
    return axios.isAxiosError(error)
  }
}
