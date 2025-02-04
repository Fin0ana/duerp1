'use client'
import Navbar from '@/components/Navbar'; 

const TarifPage: React.FC = () => {
  return (
    <div>
      <Navbar /> {/* Inclusion du Navbar */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Nos Tarifs</h1>
        <p>
          Consultez nos tarifs pour les différents services proposés...
        </p>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li>Service A : 50€</li>
          <li>Service B : 100€</li>
          <li>Service C : 150€</li>
        </ul>
      </div>
    </div>
  );
}

export default TarifPage;