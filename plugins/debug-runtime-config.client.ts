export default defineNuxtPlugin(() => {
  if (process.client) {
    console.log('🔍 Debug: Plugin debug-runtime-config.client.ts chargé')
    
    try {
      const config = useRuntimeConfig()
      console.log('📋 Configuration complète:', config)
      console.log('🎯 Configuration publique:', config.public)
      console.log('🔥 Configuration Firebase:', config.public.firebaseConfig)
      
      // Test de validation
      const firebaseConfig = config.public.firebaseConfig
      const isValid = firebaseConfig && 
                     firebaseConfig.apiKey && 
                     firebaseConfig.authDomain && 
                     firebaseConfig.projectId
      
      console.log('✅ Configuration Firebase valide:', isValid)
      
      if (!isValid) {
        console.error('❌ Configuration Firebase invalide:')
        console.error('   apiKey:', firebaseConfig?.apiKey ? 'DÉFINIE' : 'NON DÉFINIE')
        console.error('   authDomain:', firebaseConfig?.authDomain ? 'DÉFINIE' : 'NON DÉFINIE')
        console.error('   projectId:', firebaseConfig?.projectId ? 'DÉFINIE' : 'NON DÉFINIE')
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'accès à useRuntimeConfig():', error)
    }
  }
})
