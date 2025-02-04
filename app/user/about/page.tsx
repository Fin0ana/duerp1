import Navbar from '@/components/Navbar';  // Importation du composant Navbar
import Link from 'next/link';

const AboutPage: React.FC = () => {
  return (
    <div>
    
      <Navbar />

      {/* Contenu de la page About */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>À Propos de Nous</h1>
        <p>Ceci est la page "À Propos" accessible uniquement depuis la section utilisateur.</p>

      </div>
    </div>
  );
}

export default AboutPage;