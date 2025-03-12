// 'use client';
// import React from 'react';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/FooterUser';

// const PolitiquePage: React.FC = () => {
//   return (
//     <div>
//       <Navbar />
//       <div className="container mx-auto p-4 mt-16 flex">
//         {/* Colonne des liens dans le NavBar */}
//         <nav className="w-1/4 fixed top-36 left-4 z-0">
//           <ul className="space-y-2">
//             <li><a href="#introduction" className="text-blue-500 underline">Introduction</a></li>
//             <li><a href="#collecte" className="text-blue-500 underline">Collecte d’Informations Personnelles</a></li>
//             <li><a href="#utilisation" className="text-blue-500 underline">Utilisation de Vos Informations Personnelles</a></li>
//             <li><a href="#divulgation" className="text-blue-500 underline">Divulgation de Vos Informations Personnelles</a></li>
//             <li><a href="#transferts" className="text-blue-500 underline">Transferts Internationaux de Données</a></li>
//             <li><a href="#securite" className="text-blue-500 underline">Sécurité de Vos Informations Personnelles</a></li>
//             <li><a href="#droits" className="text-blue-500 underline">Vos Droits</a></li>
//             <li><a href="#amendements" className="text-blue-500 underline">Amendements</a></li>
//             <li><a href="#cookies" className="text-blue-500 underline">Cookies</a></li>
//             <li><a href="#contact" className="text-blue-500 underline">Contact</a></li>
//           </ul>
//         </nav>

//         {/* Contenu des sections */}
//         <div className="w-3/4 ml-auto pl-4 space-y-4">
//           <div id="transferts" className="pt-24">
//             <h2 className="text-xl font-bold">Transferts Internationaux de Données</h2>
//             <p>Nous pouvons stocker, traiter et transférer vos informations dans des pays qui ne garantissent pas un niveau de protection équivalent.</p>
//           </div>
//           <div id="securite" className="pt-24">
//             <h2 className="text-xl font-bold">Sécurité de Vos Informations Personnelles</h2>
//             <p>Nous prenons des mesures techniques et organisationnelles appropriées pour protéger vos informations contre l’accès non autorisé.</p>
//           </div>
//           <div id="droits" className="pt-24">
//             <h2 className="text-xl font-bold">Vos Droits</h2>
//             <p>Vous avez le droit d’accéder, de corriger ou de supprimer vos données personnelles.</p>
//           </div>
//           <div id="amendements" className="pt-24">
//             <h2 className="text-xl font-bold">Amendements</h2>
//             <p>Nous pouvons mettre à jour cette politique de confidentialité à tout moment.</p>
//           </div>
//           <div id="cookies" className="pt-24">
//             <h2 className="text-xl font-bold">Cookies</h2>
//             <p>Notre site utilise des cookies pour améliorer votre expérience de navigation.</p>
//           </div>
//           <div id="contact" className="pt-24">
//             <h2 className="text-xl font-bold">Contact</h2>
//             <p>Pour toute question, veuillez nous contacter à contact@notresite.com.</p>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default PolitiquePage;


'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/FooterUser';
import { FaFileAlt, FaUser, FaLock, FaShareAlt, FaGlobe, FaShieldAlt, FaRegAddressCard, FaRegEdit, FaCookie, FaEnvelope } from 'react-icons/fa'; // Importer les icônes correspondantes

const PolitiquePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 mt-16 flex">
        {/* Colonne des liens dans le NavBar */}
        <nav className="w-1/4 fixed top-36 left-4 z-10 border-r-2 border-gray-200 shadow-lg rounded-lg bg-white p-3">
  <ul> {/* Réduit l'espace entre les liens */}
    <li className="flex items-center hover:bg-blue-50 rounded-lg transition duration-300 py-2">
      <FaFileAlt className="text-blue-500 text-xl mr-3" />
      <a href="#introduction" className="text-blue-500 hover:text-blue-700 text-sm font-medium"> {/* Réduit la taille de la police */}
        1. Introduction
      </a>
    </li>
    <li className="flex items-center hover:bg-blue-50 rounded-lg transition duration-300 py-2">
      <FaUser className="text-blue-500 text-xl mr-3" />
      <a href="#collecte" className="text-blue-500 hover:text-blue-700 text-sm font-medium">
        2. Collecte d’Informations Personnelles
      </a>
    </li>
    <li className="flex items-center hover:bg-blue-50 rounded-lg transition duration-300 py-2">
      <FaLock className="text-blue-500 text-xl mr-3" />
      <a href="#utilisation" className="text-blue-500 hover:text-blue-700 text-sm font-medium">
        3. Utilisation de Vos Informations Personnelles
      </a>
    </li>
    <li className="flex items-center hover:bg-blue-50 rounded-lg transition duration-300 py-2">
      <FaShareAlt className="text-blue-500 text-xl mr-3" />
      <a href="#divulgation" className="text-blue-500 hover:text-blue-700 text-sm font-medium">
        4. Divulgation de Vos Informations Personnelles
      </a>
    </li>
    <li className="flex items-center hover:bg-blue-50 rounded-lg transition duration-300 py-2">
      <FaGlobe className="text-blue-500 text-xl mr-3" />
      <a href="#transferts" className="text-blue-500 hover:text-blue-700 text-sm font-medium">
        5. Transferts Internationaux de Données
      </a>
    </li>
    <li className="flex items-center hover:bg-blue-50 rounded-lg transition duration-300 py-2">
      <FaShieldAlt className="text-blue-500 text-xl mr-3" />
      <a href="#securite" className="text-blue-500 hover:text-blue-700 text-sm font-medium">
        6. Sécurité de Vos Informations Personnelles
      </a>
    </li>
    <li className="flex items-center hover:bg-blue-50 rounded-lg transition duration-300 py-2">
      <FaRegAddressCard className="text-blue-500 text-xl mr-3" />
      <a href="#droits" className="text-blue-500 hover:text-blue-700 text-sm font-medium">
        7. Vos Droits
      </a>
    </li>
    <li className="flex items-center hover:bg-blue-50 rounded-lg transition duration-300 py-2">
      <FaRegEdit className="text-blue-500 text-xl mr-3" />
      <a href="#amendements" className="text-blue-500 hover:text-blue-700 text-sm font-medium">
        8. Amendements
      </a>
    </li>
    <li className="flex items-center hover:bg-blue-50 rounded-lg transition duration-300 py-2">
      <FaCookie className="text-blue-500 text-xl mr-3" />
      <a href="#cookies" className="text-blue-500 hover:text-blue-700 text-sm font-medium">
        9. Cookies
      </a>
    </li>
    <li className="flex items-center hover:bg-blue-50 rounded-lg transition duration-300 py-2">
      <FaEnvelope className="text-blue-500 text-xl mr-3" />
      <a href="#contact" className="text-blue-500 hover:text-blue-700 text-sm font-medium">
        10. Contact
      </a>
    </li>
  </ul>
</nav>


{/* Contenu des sections */}
<div className="w-3/4 ml-auto pl-4 space-y-6">
  <div id="transferts" className="pt-24 bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    <h2 className="text-2xl font-semibold text-blue-600 mb-3">1. Transferts Internationaux de Données</h2>
    <p className="text-gray-700 leading-relaxed">
      Nous pouvons stocker, traiter et transférer vos informations dans des pays qui ne garantissent pas un niveau de protection équivalent.
    </p>
  </div>
  <div id="securite" className="pt-24 bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    <h2 className="text-2xl font-semibold text-green-600 mb-3">2. Sécurité de Vos Informations Personnelles</h2>
    <p className="text-gray-700 leading-relaxed">
      Nous prenons des mesures techniques et organisationnelles appropriées pour protéger vos informations contre l’accès non autorisé.
    </p>
  </div>
  <div id="droits" className="pt-24 bg-yellow-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    <h2 className="text-2xl font-semibold text-yellow-600 mb-3">3. Vos Droits</h2>
    <p className="text-gray-700 leading-relaxed">
      Vous avez le droit d’accéder, de corriger ou de supprimer vos données personnelles.
    </p>
  </div>
  <div id="amendements" className="pt-24 bg-purple-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    <h2 className="text-2xl font-semibold text-purple-600 mb-3">4. Amendements</h2>
    <p className="text-gray-700 leading-relaxed">
      Nous pouvons mettre à jour cette politique de confidentialité à tout moment.
    </p>
  </div>
  <div id="cookies" className="pt-24 bg-orange-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    <h2 className="text-2xl font-semibold text-orange-600 mb-3">5. Cookies</h2>
    <p className="text-gray-700 leading-relaxed">
      Notre site utilise des cookies pour améliorer votre expérience de navigation.
    </p>
  </div>
  <div id="contact" className="pt-24 bg-teal-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    <h2 className="text-2xl font-semibold text-teal-600 mb-3">6. Contact</h2>
    <p className="text-gray-700 leading-relaxed">
      Pour toute question, veuillez nous contacter à <a href="mailto:contact@notresite.com" className="text-blue-500 hover:text-blue-700">contact@notresite.com</a>.
    </p>
  </div>
</div>


      </div>
      <Footer />
    </div>
  );
};

export default PolitiquePage;
