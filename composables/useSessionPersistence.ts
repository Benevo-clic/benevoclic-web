import { ref } from 'vue'

export interface SessionData {
  idToken: string
  refreshToken: string
  idUser: string
  isConnected: boolean
  userData?: any
  lastActivity: number
  expiresAt: number
}

export const useSessionPersistence = () => {
  const SESSION_DB_NAME = 'benevoclic_session'
  const SESSION_STORE_NAME = 'session_data'
  const SESSION_KEY = 'benevoclic_session'
  const isInitialized = ref(false)

  // Initialiser IndexedDB
  const initIndexedDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('IndexedDB not available'))
        return
      }

      const request = indexedDB.open(SESSION_DB_NAME, 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(SESSION_STORE_NAME)) {
          db.createObjectStore(SESSION_STORE_NAME, { keyPath: 'id' })
        }
      }
    })
  }

  // Sauvegarder dans IndexedDB
  const saveToIndexedDB = async (sessionData: SessionData): Promise<void> => {
    try {
      const db = await initIndexedDB()
      const transaction = db.transaction([SESSION_STORE_NAME], 'readwrite')
      const store = transaction.objectStore(SESSION_STORE_NAME)

      return new Promise((resolve, reject) => {
        const request = store.put({ id: 'current', ...sessionData })
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      throw new Error('IndexedDB save failed')
    }
  }

  // Charger depuis IndexedDB
  const loadFromIndexedDB = async (): Promise<SessionData | null> => {
    try {
      const db = await initIndexedDB()
      const transaction = db.transaction([SESSION_STORE_NAME], 'readonly')
      const store = transaction.objectStore(SESSION_STORE_NAME)

      return new Promise((resolve, reject) => {
        const request = store.get('current')
        request.onsuccess = () => {
          const result = request.result
          if (result && result.expiresAt > Date.now()) {
            resolve(result)
          } else {
            resolve(null)
          }
        }
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      return null
    }
  }

  // Sauvegarder la session avec fallback
  const saveSession = async (sessionData: SessionData): Promise<void> => {
    if (typeof window === 'undefined') return

    try {
      // IndexedDB (priorité)
      await saveToIndexedDB(sessionData)
      process.env.NODE_ENV !== 'production' && console.log('✅ Session sauvegardée dans IndexedDB')
    } catch (error) {
      try {
        // localStorage (fallback)
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
        process.env.NODE_ENV !== 'production' &&
          console.log('✅ Session sauvegardée dans localStorage')
      } catch (localError) {
        try {
          // sessionStorage (dernier recours)
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
          process.env.NODE_ENV !== 'production' &&
            console.log('✅ Session sauvegardée dans sessionStorage')
        } catch (sessionError) {
          process.env.NODE_ENV !== 'production' &&
            console.error('❌ Impossible de sauvegarder la session:', sessionError)
        }
      }
    }
  }

  // Restaurer la session avec fallback
  const restoreSession = async (): Promise<SessionData | null> => {
    if (typeof window === 'undefined') return null

    try {
      // Essayer IndexedDB en premier
      const indexedDBSession = await loadFromIndexedDB()
      if (indexedDBSession) {
        process.env.NODE_ENV !== 'production' &&
          console.log('✅ Session restaurée depuis IndexedDB')
        return indexedDBSession
      }
    } catch (error) {
      process.env.NODE_ENV !== 'production' &&
        console.warn('IndexedDB non disponible, essai localStorage')
    }

    try {
      // Essayer localStorage
      const localStorageSession = localStorage.getItem(SESSION_KEY)
      if (localStorageSession) {
        const sessionData = JSON.parse(localStorageSession) as SessionData
        if (sessionData.expiresAt > Date.now()) {
          process.env.NODE_ENV !== 'production' &&
            console.log('✅ Session restaurée depuis localStorage')
          return sessionData
        } else {
          localStorage.removeItem(SESSION_KEY)
        }
      }
    } catch (error) {
      process.env.NODE_ENV !== 'production' &&
        console.warn('localStorage non disponible, essai sessionStorage')
    }

    try {
      // Essayer sessionStorage
      const sessionStorageSession = sessionStorage.getItem(SESSION_KEY)
      if (sessionStorageSession) {
        const sessionData = JSON.parse(sessionStorageSession) as SessionData
        if (sessionData.expiresAt > Date.now()) {
          process.env.NODE_ENV !== 'production' &&
            console.log('✅ Session restaurée depuis sessionStorage')
          return sessionData
        } else {
          sessionStorage.removeItem(SESSION_KEY)
        }
      }
    } catch (error) {
      process.env.NODE_ENV !== 'production' && console.warn('sessionStorage non disponible')
    }

    return null
  }

  // Nettoyer toutes les sessions
  const clearSession = async (): Promise<void> => {
    if (typeof window === 'undefined') return

    try {
      // Nettoyer IndexedDB
      const db = await initIndexedDB()
      const transaction = db.transaction([SESSION_STORE_NAME], 'readwrite')
      const store = transaction.objectStore(SESSION_STORE_NAME)
      store.clear()
    } catch (error) {
      process.env.NODE_ENV !== 'production' && console.warn('Impossible de nettoyer IndexedDB')
    }

    try {
      // Nettoyer localStorage
      localStorage.removeItem(SESSION_KEY)
    } catch (error) {
      process.env.NODE_ENV !== 'production' && console.warn('Impossible de nettoyer localStorage')
    }

    try {
      // Nettoyer sessionStorage
      sessionStorage.removeItem(SESSION_KEY)
    } catch (error) {
      process.env.NODE_ENV !== 'production' && console.warn('Impossible de nettoyer sessionStorage')
    }

    process.env.NODE_ENV !== 'production' && console.log('✅ Session nettoyée de tous les storages')
  }

  // Vérifier si la session est valide
  const isSessionValid = (sessionData: SessionData): boolean => {
    return sessionData.expiresAt > Date.now()
  }

  return {
    saveSession,
    restoreSession,
    clearSession,
    isSessionValid,
    isInitialized
  }
}
