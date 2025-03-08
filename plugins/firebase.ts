import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { defineNuxtPlugin } from "#app";

interface FirebasePlugin {
  auth: Auth | null;
  provider: GoogleAuthProvider | null;
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  
  const { public: { ssr } } = config;
  const isClient = !ssr;
  
  if (isClient) {
    try {
      const app = initializeApp(config.public.firebaseConfig);
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      return {
        provide: {
          firebase: { auth, provider } as FirebasePlugin
        }
      };
    } catch (error) {
      console.error("Erreur d'initialisation Firebase:", error);
    }
  }

  return {
    provide: {
      firebase: { auth: null, provider: null } as FirebasePlugin
    }
  };
});
