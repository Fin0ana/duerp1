"use client"; // Utilisation des hooks React

import { useState } from 'react';
import { useRouter } from 'next/navigation';
//import Navbar from '../components/Navbar';
import Navbar from '../../../components/Navbar'

const ConnexionPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simulation de la vérification des identifiants
    if (username === 'user' && password === 'user123') {
      // Si les identifiants sont corrects, redirection vers la page utilisateur
      router.push('/admin');
    } else {
      // Sinon, afficher un message d'erreur
      setError('Identifiants incorrects');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
        <h1>Connexion Utilisateur</h1>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ padding: '10px', width: '100%', fontSize: '16px' }}
              placeholder="Entrez votre nom d'utilisateur"
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '10px', width: '100%', fontSize: '16px' }}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button
            type="submit"
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}

export default ConnexionPage;