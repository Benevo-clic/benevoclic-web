export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Debug: Log the configuration at startup
  console.log('🔧 Runtime Config Plugin - Configuration loaded:', {
    api_base_url: config.private.api_base_url,
    api_sirene_url: config.private.api_sirene_url,
    api_sirene_key: config.private.api_sirene_key ? 'DÉFINIE' : 'NON DÉFINIE',
    firebase_api_key: config.public.firebaseConfig.apiKey ? 'DÉFINIE' : 'NON DÉFINIE'
  })
  
  // Vérifier que les variables critiques sont définies
  if (!config.private.api_base_url) {
    console.error('❌ ERREUR: API_BASE_URL non défini dans la configuration runtime')
    console.error('Variables d\'environnement disponibles:', {
      API_BASE_URL: process.env.API_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT
    })
  }
})
