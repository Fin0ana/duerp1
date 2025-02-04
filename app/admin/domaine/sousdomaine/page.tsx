'use client'
import React, { useState } from 'react';
import AdminLayout from '../../../../components/AdminLayout';

interface SousDomaineProps {
  sousDomaines: string[];
  selectedSousDomaine: string;
  onChangeSousDomaine: (value: string) => void;
}

const SousDomaine: React.FC<SousDomaineProps> = ({ sousDomaines, selectedSousDomaine, onChangeSousDomaine }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter sous-domaines based on the search term
  const filteredSousDomaines = sousDomaines?.filter((sousDomaine) =>
    sousDomaine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ padding: '20px', color: '#6BA3BE' }}>
        {/* Search Bar */}
        <div className="mb-4">
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
        <label htmlFor="sous-domaine" className="block mb-2 text-lg font-semibold" style={{ color: '#0C969C' }}>
          Sous-Domaine :
        </label>
        <select
          id="sous-domaine"
          value={selectedSousDomaine}
          onChange={(e) => onChangeSousDomaine(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: '#032F30',
            color: '#6BA3BE',
            border: '1px solid #0A7075',
          }}
        >
          <option value="">-- Choisissez un sous-domaine --</option>
          {Array.isArray(filteredSousDomaines) && filteredSousDomaines.length > 0 ? (
            filteredSousDomaines.map((sousDomaine) => (
              <option key={sousDomaine} value={sousDomaine} style={{ backgroundColor: '#031716' }}>
                {sousDomaine}
              </option>
            ))
          ) : (
            <option disabled>Aucun sous-domaine disponible</option>
          )}
        </select>
      </div>
    </AdminLayout>
  );
};

export default SousDomaine;