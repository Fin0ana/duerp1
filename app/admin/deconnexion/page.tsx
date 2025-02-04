"use client"; // Marquer ce fichier comme un composant client

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Utiliser next/navigation pour les composants clients

const DeconnexionPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Ici, vous pouvez ajouter la logique de déconnexion, comme effacer les cookies ou le stockage local si nécessaire.
    // Par exemple : localStorage.removeItem('userToken');

    // Rediriger l'utilisateur vers la page utilisateur après la déconnexion
    router.push('/');
  }, [router]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Déconnexion</h1>
      <p>Vous êtes en cours de déconnexion...</p>
    </div>
  );
}

export default DeconnexionPage;