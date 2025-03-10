import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, browserPopupRedirectResolver } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { defineNuxtPlugin } from "#app";

interface FirebasePlugin {
  auth: Auth | null;
  provider: GoogleAuthProvider | null;
  resolver: typeof browserPopupRedirectResolver | null;
}

export default defineNuxtPlugin(() => {
  try {
    const config = useRuntimeConfig();
    const app = initializeApp(config.public.firebaseConfig);
    const auth = getAuth(app);
    
    const provider = new GoogleAuthProvider();

    return {
      provide: {
        firebase: { 
          auth, 
          provider,
          resolver: browserPopupRedirectResolver  // Ajout du resolver
        } as FirebasePlugin
      }
    };
  } catch (error) {
    console.error("Erreur d'initialisation de Firebase", error);
    return {
      provide: {
        firebase: { auth: null, provider: null } as FirebasePlugin
      }
    };
  }
});
