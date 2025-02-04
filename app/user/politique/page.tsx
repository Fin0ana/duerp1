'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/FooterUser';

const PolitiquePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 mt-16 flex">
        {/* Colonne des liens dans le NavBar */}
        <nav className="w-1/4 fixed top-36 left-4 z-0">
          <ul className="space-y-2">
            <li><a href="#introduction" className="text-blue-500 underline">Introduction</a></li>
            <li><a href="#collecte" className="text-blue-500 underline">Collecte d’Informations Personnelles</a></li>
            <li><a href="#utilisation" className="text-blue-500 underline">Utilisation de Vos Informations Personnelles</a></li>
            <li><a href="#divulgation" className="text-blue-500 underline">Divulgation de Vos Informations Personnelles</a></li>
            <li><a href="#transferts" className="text-blue-500 underline">Transferts Internationaux de Données</a></li>
            <li><a href="#securite" className="text-blue-500 underline">Sécurité de Vos Informations Personnelles</a></li>
            <li><a href="#droits" className="text-blue-500 underline">Vos Droits</a></li>
            <li><a href="#amendements" className="text-blue-500 underline">Amendements</a></li>
            <li><a href="#cookies" className="text-blue-500 underline">Cookies</a></li>
            <li><a href="#contact" className="text-blue-500 underline">Contact</a></li>
          </ul>
        </nav>

        {/* Contenu des sections */}
        <div className="w-3/4 ml-auto pl-4 space-y-4">
          <div id="transferts" className="pt-24">
            <h2 className="text-xl font-bold">Transferts Internationaux de Données</h2>
            <p>Nous pouvons stocker, traiter et transférer vos informations dans des pays qui ne garantissent pas un niveau de protection équivalent.</p>
          </div>
          <div id="securite" className="pt-24">
            <h2 className="text-xl font-bold">Sécurité de Vos Informations Personnelles</h2>
            <p>Nous prenons des mesures techniques et organisationnelles appropriées pour protéger vos informations contre l’accès non autorisé.</p>
          </div>
          <div id="droits" className="pt-24">
            <h2 className="text-xl font-bold">Vos Droits</h2>
            <p>Vous avez le droit d’accéder, de corriger ou de supprimer vos données personnelles.</p>
          </div>
          <div id="amendements" className="pt-24">
            <h2 className="text-xl font-bold">Amendements</h2>
            <p>Nous pouvons mettre à jour cette politique de confidentialité à tout moment.</p>
          </div>
          <div id="cookies" className="pt-24">
            <h2 className="text-xl font-bold">Cookies</h2>
            <p>Notre site utilise des cookies pour améliorer votre expérience de navigation.</p>
          </div>
          <div id="contact" className="pt-24">
            <h2 className="text-xl font-bold">Contact</h2>
            <p>Pour toute question, veuillez nous contacter à contact@notresite.com.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PolitiquePage;
