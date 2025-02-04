'use client'
import React, { useState, useEffect } from 'react';

const Cookie: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showChoices, setShowChoices] = useState<boolean>(false);
  const [basicFeaturesEnabled, setBasicFeaturesEnabled] = useState<boolean>(true);
  const [statisticsEnabled, setStatisticsEnabled] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = (): void => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = (): void => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  const toggleChoices = (): void => {
    setShowChoices(!showChoices);
  };

  const toggleBasicFeatures = (): void => {
    setBasicFeaturesEnabled(!basicFeaturesEnabled);
  };

  const toggleStatistics = (): void => {
    setStatisticsEnabled(!statisticsEnabled);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-10 inset-x-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-sm mx-auto text-center shadow-lg">
        {!showChoices ? (
          <>
            <p className="text-xs mb-2 text-black">
              Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences ou refuser les cookies.
            </p>
            <div className="flex flex-col md:flex-row justify-center md:justify-end space-y-1 md:space-y-0 md:space-x-1 mt-6">
              <button 
                onClick={toggleChoices} 
                className="text-blue-900 font-bold bg-white border border-blue-900 py-1 px-2 text-xs hover:bg-blue-900 hover:text-white transition-colors duration-300 rounded-full">
                GÉRER MES CHOIX
              </button>
              <button 
                onClick={handleDecline} 
                className="text-blue-900 font-bold bg-white border border-blue-900 py-1 px-2 text-xs hover:bg-blue-900 hover:text-white transition-colors duration-300 rounded-full">
                TOUT REFUSER
              </button>
              <button 
                onClick={handleAccept} 
                className="text-blue-900 font-bold bg-white border border-blue-900 py-1 px-2 text-xs hover:bg-blue-900 hover:text-white transition-colors duration-300 rounded-full">
                TOUT ACCEPTER
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs mb-2 text-black">
              Vous pouvez choisir de désactiver certaines catégories de cookies.
            </p>
            <div className="text-left">
              <div className="flex justify-between items-center py-2">
                <span className="text-black text-xs">Fonctionnalités de base</span>
                <div 
                  onClick={toggleBasicFeatures} 
                  className={`relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in ${basicFeaturesEnabled ? 'bg-blue-500' : 'bg-gray-300'} rounded-full`}
                >
                  <span 
                    className={`absolute left-0 inline-block w-6 h-6 bg-white border-2 rounded-full shadow transform transition-transform duration-200 ease-in-out ${basicFeaturesEnabled ? 'translate-x-6' : ''}`}></span>
                  <input type="checkbox" className="absolute opacity-0 w-full h-full" />
                </div>
              </div>
              <p className="text-gray-600 text-xs mb-4">Ces informations sont requises pour assurer le bon fonctionnement de notre site.</p>
              <div className="flex justify-between items-center py-2">
                <span className="text-black text-xs">Statistiques</span>
                <div 
                  onClick={toggleStatistics} 
                  className={`relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in ${statisticsEnabled ? 'bg-blue-500' : 'bg-gray-300'} rounded-full`}
                >
                  <span 
                    className={`absolute left-0 inline-block w-6 h-6 bg-white border-2 rounded-full shadow transform transition-transform duration-200 ease-in-out ${statisticsEnabled ? 'translate-x-6' : ''}`}></span>
                  <input type="checkbox" className="absolute opacity-0 w-full h-full" />
                </div>
              </div>
              <p className="text-gray-600 text-xs mb-4">Autoriser DUERP à recueillir, mesurer et analyser comment notre site est utilisé.</p>
            </div>
            <div className="flex justify-center space-x-1 mt-6">
              <button 
                onClick={handleDecline} 
                className="text-blue-900 font-bold bg-white border border-blue-900 py-1 px-2 text-xs hover:bg-blue-900 hover:text-white transition-colors duration-300 rounded-full">
                TOUT REFUSER
              </button>
              <button 
                onClick={handleAccept} 
                className="text-blue-900 font-bold bg-white border border-blue-900 py-1 px-2 text-xs hover:bg-blue-900 hover:text-white transition-colors duration-300 rounded-full">
                TOUT ACCEPTER
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cookie;