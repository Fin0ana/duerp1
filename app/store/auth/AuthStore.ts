// store/auth/authStore.ts

import create from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_CURRENT_USER } from "../../constants/auth";
import setCurrentUserOnServer from "../../actions/setCurrentUser";

// Définition de l'interface représentant l'utilisateur courant
export interface CurrentUser {
  accessToken?: string;
  // Ajoutez ici d'autres propriétés de l'utilisateur si besoin
}

// Interface décrivant le state et les actions de votre store
interface AuthStore {
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  resetCurrentUser: () => void;
}

// Création du store avec persistance dans le localStorage
const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Valeur par défaut de l'utilisateur courant
      currentUser: DEFAULT_CURRENT_USER,

      // Action pour mettre à jour l'utilisateur courant
      setCurrentUser: (user: CurrentUser) => {
        set({ currentUser: user });
        // Mise à jour côté serveur si nécessaire
        setCurrentUserOnServer(user);
      },

      // Action pour réinitialiser l'utilisateur courant
      resetCurrentUser: () => {
        set({ currentUser: DEFAULT_CURRENT_USER });
        setCurrentUserOnServer(DEFAULT_CURRENT_USER);
      },
    }),
    {
      name: "auth-storage", // Clé de stockage dans le localStorage
      // Pour s'assurer que localStorage est accessible côté client
      getStorage: () => (typeof window !== "undefined" ? localStorage : undefined),
    }
  )
);

export default useAuthStore;
