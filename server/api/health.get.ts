import { defineEventHandler } from 'h3'
import { RetryManager } from '~/utils/retry-manager'
import { EnvValidator } from '~/utils/env-validator'

/**
 * Endpoint de health check pour surveiller l'état des services
 * Vérifie la connectivité avec l'API backend et les services externes
 */

interface HealthCheck {
  status: 'ok' | 'error' | 'warning'
  message: string
  timestamp: string
  duration?: number
}

interface HealthResponse {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  version: string
  uptime: number
  checks: Record<string, HealthCheck>
}

export default defineEventHandler(async (): Promise<HealthResponse> => {
  const startTime = Date.now()
  const checks: Record<string, HealthCheck> = {}

  try {
    // 1. Vérification des variables d'environnement
    const envStart = Date.now()
    try {
      EnvValidator.validateRequired()
      checks.environment = {
        status: 'ok',
        message: "Variables d'environnement valides",
        timestamp: new Date().toISOString(),
        duration: Date.now() - envStart
      }
    } catch (error: any) {
      checks.environment = {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
        duration: Date.now() - envStart
      }
    }

    // 2. Vérification de la connectivité API backend
    const apiStart = Date.now()
    try {
      const config = EnvValidator.getConfig()
      const response = await RetryManager.get(
        `${config.api.baseUrl}/health`,
        { retry: { maxRetries: 1, timeout: 5000 } },
        { endpoint: 'health', action: 'api-check' }
      )

      checks.api = {
        status: 'ok',
        message: `API backend accessible (${response.status})`,
        timestamp: new Date().toISOString(),
        duration: Date.now() - apiStart
      }
    } catch (error: any) {
      checks.api = {
        status: 'error',
        message: `API backend inaccessible: ${error.message}`,
        timestamp: new Date().toISOString(),
        duration: Date.now() - apiStart
      }
    }

    // 3. Vérification de la connectivité Firebase
    const firebaseStart = Date.now()
    try {
      const config = EnvValidator.getConfig()
      // Test simple de configuration Firebase
      if (config.firebase.apiKey && config.firebase.projectId) {
        checks.firebase = {
          status: 'ok',
          message: 'Configuration Firebase valide',
          timestamp: new Date().toISOString(),
          duration: Date.now() - firebaseStart
        }
      } else {
        checks.firebase = {
          status: 'warning',
          message: 'Configuration Firebase incomplète',
          timestamp: new Date().toISOString(),
          duration: Date.now() - firebaseStart
        }
      }
    } catch (error: any) {
      checks.firebase = {
        status: 'error',
        message: `Erreur Firebase: ${error.message}`,
        timestamp: new Date().toISOString(),
        duration: Date.now() - firebaseStart
      }
    }

    // 4. Vérification de la mémoire
    const memoryStart = Date.now()
    try {
      const memUsage = process.memoryUsage()
      const memUsageMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      }

      // Seuils d'alerte
      const isHighMemory = memUsageMB.heapUsed > 500 // 500MB
      const isVeryHighMemory = memUsageMB.heapUsed > 1000 // 1GB

      checks.memory = {
        status: isVeryHighMemory ? 'error' : isHighMemory ? 'warning' : 'ok',
        message: `Mémoire: ${memUsageMB.heapUsed}MB utilisé / ${memUsageMB.heapTotal}MB total`,
        timestamp: new Date().toISOString(),
        duration: Date.now() - memoryStart
      }
    } catch (error: any) {
      checks.memory = {
        status: 'error',
        message: `Erreur mémoire: ${error.message}`,
        timestamp: new Date().toISOString(),
        duration: Date.now() - memoryStart
      }
    }

    // 5. Vérification du système de fichiers
    const fsStart = Date.now()
    try {
      const fs = await import('fs/promises')
      await fs.access('.')
      checks.filesystem = {
        status: 'ok',
        message: 'Système de fichiers accessible',
        timestamp: new Date().toISOString(),
        duration: Date.now() - fsStart
      }
    } catch (error: any) {
      checks.filesystem = {
        status: 'error',
        message: `Erreur système de fichiers: ${error.message}`,
        timestamp: new Date().toISOString(),
        duration: Date.now() - fsStart
      }
    }

    // 6. Vérification de la connectivité réseau
    const networkStart = Date.now()
    try {
      const dns = await import('dns/promises')
      await dns.lookup('google.com')
      checks.network = {
        status: 'ok',
        message: 'Connectivité réseau OK',
        timestamp: new Date().toISOString(),
        duration: Date.now() - networkStart
      }
    } catch (error: any) {
      checks.network = {
        status: 'warning',
        message: `Problème réseau: ${error.message}`,
        timestamp: new Date().toISOString(),
        duration: Date.now() - networkStart
      }
    }
  } catch (error: any) {
    // Erreur générale du health check
    checks.general = {
      status: 'error',
      message: `Erreur générale: ${error.message}`,
      timestamp: new Date().toISOString()
    }
  }

  // Déterminer le statut global
  const allChecks = Object.values(checks)
  const errorCount = allChecks.filter(c => c.status === 'error').length
  const warningCount = allChecks.filter(c => c.status === 'warning').length

  let globalStatus: 'healthy' | 'unhealthy' | 'degraded'
  if (errorCount > 0) {
    globalStatus = 'unhealthy'
  } else if (warningCount > 0) {
    globalStatus = 'degraded'
  } else {
    globalStatus = 'healthy'
  }

  const response: HealthResponse = {
    status: globalStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    checks
  }

  // Log du statut
  if (globalStatus === 'unhealthy') {
    console.error('🚨 Health check: UNHEALTHY', response)
  } else if (globalStatus === 'degraded') {
    console.warn('⚠️ Health check: DEGRADED', response)
  } else {
    console.log('✅ Health check: HEALTHY', { duration: Date.now() - startTime })
  }

  return response
})
