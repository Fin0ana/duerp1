'use client'
import React, { useState } from 'react';
import AdminLayout from '../../../../components/AdminLayout';

interface DomaineProps {
  domaines: Array<{ domaine: string }>;
  selectedDomaine: string;
  onChangeDomaine: (value: string) => void;
}

const Domaine: React.FC<DomaineProps> = ({ domaines, selectedDomaine, onChangeDomaine }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter domaines based on the search term
  const filteredDomaines = domaines?.filter((domaine) =>
    domaine.domaine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ padding: '20px', color: '#6BA3BE' }}>
        {/* Search Bar */}
        <div className="mb-4">
          {/* <label htmlFor="search" className="block mb-2 text-lg font-semibold" style={{ color: '#0C969C' }}>
            Recherche de Domaine
          </label> */}
          <input
            type="text"
            id="search"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #032F30',
              backgroundColor: '#031716',
              color: '#6BA3BE',
            }}
          />
        </div>

        {/* Dropdown */}
        <label htmlFor="domaine" className="block mb-2 text-lg font-semibold" style={{ color: '#0C969C' }}>
          Domaine d'Activité :
        </label>
        <select
          id="domaine"
          value={selectedDomaine}
          onChange={(e) => onChangeDomaine(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: '#032F30',
            color: '#6BA3BE',
            border: '1px solid #0A7075',
          }}
        >
          <option value="">-- Choisissez un domaine --</option>
          {Array.isArray(filteredDomaines) && filteredDomaines.length > 0 ? (
            filteredDomaines.map((domaine) => (
              <option key={domaine.domaine} value={domaine.domaine} style={{ backgroundColor: '#031716' }}>
                {domaine.domaine}
              </option>
            ))
          ) : (
            <option disabled>Aucun domaine disponible</option>
          )}
        </select>
      </div>
    </AdminLayout>
  );
};

export default Domaine;