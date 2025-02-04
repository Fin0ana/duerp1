'use client';
import React, { useState } from 'react';
import Secteur from '../secteur/page';
import Domaine from '../domaine/page';
import SousDomaine from '../sousdomaine/page';
import AdminLayout from '../../../../components/AdminLayout';

interface SousDomaineOption {
  domaine: string;
  sousDomaines: string[];
}

interface SecteurOption {
  secteur: string;
  domaines: SousDomaineOption[];
}

const secteurOptions: SecteurOption[] = [
  {
    secteur: 'Technologie',
    domaines: [
      { domaine: 'Développement logiciel', sousDomaines: ['Front-end', 'Back-end', 'Full Stack'] },
      { domaine: 'Réseau et Sécurité', sousDomaines: ['Administration Réseau', 'Sécurité Informatique'] }
    ]
  },
  {
    secteur: 'Santé',
    domaines: [
      { domaine: 'Médecine', sousDomaines: ['Chirurgie', 'Pédiatrie', 'Cardiologie'] },
      { domaine: 'Pharmacie', sousDomaines: ['Pharmacologie', 'Recherche Clinique'] }
    ]
  }
];

const FormulaireSecteur: React.FC = () => {
  const [selectedSecteur, setSelectedSecteur] = useState<string>('');
  const [selectedDomaine, setSelectedDomaine] = useState<string>('');
  const [selectedSousDomaine, setSelectedSousDomaine] = useState<string>('');
  const [sousDomaines, setSousDomaines] = useState<string[]>([]);
  const [domaines, setDomaines] = useState<SousDomaineOption[]>([]);

  const handleSecteurChange = (secteur: string) => {
    setSelectedSecteur(secteur);
    setSelectedDomaine('');
    setSelectedSousDomaine('');
    setSousDomaines([]);

    const selectedSecteurData = secteurOptions.find((s) => s.secteur === secteur);
    if (selectedSecteurData) {
      setDomaines(selectedSecteurData.domaines);
    } else {
      setDomaines([]);
    }
  };

  const handleDomaineChange = (domaine: string) => {
    setSelectedDomaine(domaine);
    const selectedSecteurData = secteurOptions.find((s) => s.secteur === selectedSecteur);
    const domaineData = selectedSecteurData?.domaines.find((d) => d.domaine === domaine);
    setSousDomaines(domaineData?.sousDomaines || []);
    setSelectedSousDomaine('');
  };

  return (
    <AdminLayout>
      <div>
        <h2>Formulaire Secteur d'Activité</h2>
        <Secteur
          secteurs={secteurOptions}
          selectedSecteur={selectedSecteur}
          onChangeSecteur={handleSecteurChange}
        />
        <Domaine
          domaines={domaines}
          selectedDomaine={selectedDomaine}
          onChangeDomaine={handleDomaineChange}
        />
        <SousDomaine
          sousDomaines={sousDomaines}
          selectedSousDomaine={selectedSousDomaine}
          onChangeSousDomaine={setSelectedSousDomaine}
        />
      </div>
    </AdminLayout>
  );
};

export default FormulaireSecteur;