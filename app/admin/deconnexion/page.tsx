"use client"; // Marquer ce fichier comme un composant client

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Utiliser next/navigation pour les composants clients
import useAuthStore from "@/app/store/auth/AuthStore";
import { showErrorToast } from "@/app/utils/toast";

const DeconnexionPage: React.FC = () => {
  const router = useRouter();

  const { logout } = useAuthStore();
  useEffect(() => {
    logout()
      .then(() => {
        router.push("/");
      })
      .catch((err) => {
        showErrorToast(err);
      });
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Déconnexion</h1>
      <p>Vous êtes en cours de déconnexion...</p>
    </div>
  );
};

export default DeconnexionPage;
