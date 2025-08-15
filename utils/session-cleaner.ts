export class SessionCleaner {
  static async cleanUserSession(): Promise<void> {
    try {
      await this.clearAllCookies()

      this.clearLocalStorage()

      this.clearSessionStorage()

      await this.clearIndexedDB()

      this.redirectToHome()
    } catch (error) {
      process.env.NODE_ENV !== 'production' &&
        console.error('❌ Erreur lors du nettoyage de session:', error)
      this.redirectToHome()
    }
  }

  private static async clearAllCookies(): Promise<void> {
    try {
      await $fetch('/api/auth/deleteCookies', {
        method: 'DELETE',
        credentials: 'include'
      })
    } catch (error) {
      process.env.NODE_ENV !== 'production' &&
        console.warn('⚠️ Impossible de supprimer les cookies serveur:', error)
    }

    if (process.client) {
      const cookies = document.cookie.split(';')

      for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()

        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; httpOnly`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; sameSite=strict`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; sameSite=lax`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; sameSite=none`
      }
    }
  }

  private static clearLocalStorage(): void {
    if (process.client && window.localStorage) {
      try {
        const authKeys = [
          'auth_token',
          'refresh_token',
          'user_data',
          'user_info',
          'firebase_token',
          'session_data',
          'token',
          'access_token',
          'id_token',
          'user_token',
          'app_token',
          'api_token',
          'bearer_token',
          'jwt_token',
          'session_token',
          'auth_session',
          'user_session',
          'login_token',
          'remember_token',
          'csrf_token'
        ]

        authKeys.forEach(key => {
          localStorage.removeItem(key)
        })
      } catch (error) {
        process.env.NODE_ENV !== 'production' &&
          console.warn('⚠️ Impossible de nettoyer localStorage:', error)
      }
    }
  }

  private static clearSessionStorage(): void {
    if (process.client && window.sessionStorage) {
      try {
        sessionStorage.clear()
      } catch (error) {
        process.env.NODE_ENV !== 'production' &&
          console.warn('⚠️ Impossible de nettoyer sessionStorage:', error)
      }
    }
  }

  private static async clearIndexedDB(): Promise<void> {
    if (process.client && window.indexedDB) {
      try {
        const dbNames = ['firebaseLocalStorage', 'userCache', 'sessionDB']

        for (const dbName of dbNames) {
          try {
            const deleteRequest = indexedDB.deleteDatabase(dbName)
            await new Promise((resolve, reject) => {
              deleteRequest.onsuccess = resolve
              deleteRequest.onerror = reject
            })
          } catch (error) {
            process.env.NODE_ENV !== 'production' &&
              console.warn(`⚠️ Impossible de supprimer IndexedDB ${dbName}:`, error)
          }
        }
      } catch (error) {
        process.env.NODE_ENV !== 'production' &&
          console.warn('⚠️ Impossible de nettoyer IndexedDB:', error)
      }
    }
  }

  private static redirectToHome(): void {
    if (process.client) {
      try {
        window.location.href = '/'
      } catch (error) {
        process.env.NODE_ENV !== 'production' &&
          console.error("❌ Impossible de rediriger vers l'accueil:", error)
        // Fallback : recharger la page
        window.location.reload()
      }
    }
  }

  static async forceLogout(reason: string = 'session_expired'): Promise<void> {
    process.env.NODE_ENV !== 'production' && console.warn(`🚨 Déconnexion forcée: ${reason}`)

    if (process.client) {
      this.showLogoutNotification(reason)
    }

    await this.cleanUserSession()
  }

  private static showLogoutNotification(reason: string): void {
    if (process.client) {
      try {
        const notification = document.createElement('div')
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #dc3545;
          color: white;
          padding: 15px 20px;
          border-radius: 5px;
          z-index: 9999;
          font-family: Arial, sans-serif;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `

        const messages = {
          session_expired: "Session expirée. Vous allez être redirigé vers l'accueil.",
          auth_failed: "Authentification échouée. Vous allez être redirigé vers l'accueil.",
          network_error: "Problème de connexion. Vous allez être redirigé vers l'accueil.",
          server_error: "Erreur serveur. Vous allez être redirigé vers l'accueil."
        }

        notification.textContent =
          messages[reason as keyof typeof messages] ||
          "Déconnexion automatique. Vous allez être redirigé vers l'accueil."

        document.body.appendChild(notification)

        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification)
          }
        }, 5000)
      } catch (error) {
        process.env.NODE_ENV !== 'production' &&
          console.warn("⚠️ Impossible d'afficher la notification:", error)
      }
    }
  }
}
