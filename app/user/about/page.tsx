
'use client'

import Navbar from '@/components/Navbar';
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from '@/components/FooterUser';
import { FaUser, FaStickyNote, FaBullseye } from 'react-icons/fa'; // Import des icônes
import { FaUserFriends, FaUserAlt } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto p-8 text-gray-900 mt-12 space-y-16">

        {/* Section 1 : Image de fond avec texte centré */}
        <section className="relative w-full h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src="/assets/fond.jpg"
              alt="Entreprise"
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-white text-2xl font-semibold text-center px-6">
              <span className="text-blue-400">Fondée en 2024</span>,
              <span className="font-bold"> DUERP en ligne</span> simplifie la gestion des risques
              en centralisant les informations et en automatisant la création de documents conformes.
            </p>
          </div>
        </section>

        {/* Section 2 : Notre Motivation */}
        <section className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-lg shadow-lg">
          <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://www.example.com/your-background-image.jpg')" }}></div>

          <motion.h2
            className="relative text-4xl font-bold text-white mb-6 z-10"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            Notre Motivation
          </motion.h2>

          <motion.p
            className="relative text-xl text-white z-10"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            Notre ambition est de devenir le leader de la prévention des risques afin d'aider les entreprises à assurer la sécurité de leurs employés.
          </motion.p>
        </section>

        {/* Section 3 : Nos Objectifs */}
        <section className="relative p-8 rounded-lg shadow-lg">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,rgba(0,0,0,0.2) 20%, transparent 20%, transparent 80%, rgba(0,0,0,0.2) 80%)] bg-repeat opacity-30"></div>

          <motion.h2
            className="relative text-4xl font-bold text-blue-700 mb-6 z-10"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            Nos Principaux Objectifs
          </motion.h2>

          <motion.ul
            className="relative list-disc list-inside space-y-3 pl-6 text-lg text-gray-800 z-10"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <li><FaBullseye className="inline-block text-blue-500 mr-2" /> Améliorer l’expérience utilisateur et la performance de notre plateforme</li>
            <li><FaBullseye className="inline-block text-blue-500 mr-2" /> Élargir notre réseau d’entreprises en France et à l’international</li>
            <li><FaBullseye className="inline-block text-blue-500 mr-2" /> Développer un service innovant et efficace de génération DUERP</li>
            <li><FaBullseye className="inline-block text-blue-500 mr-2" /> Optimiser la fidélisation client par un support personnalisé</li>
            <li><FaBullseye className="inline-block text-blue-500 mr-2" /> Analyser la concurrence pour proposer des solutions toujours plus performantes</li>
          </motion.ul>
        </section>

        {/* Section 4 : Nos Missions */}
        <section className="relative p-8 rounded-lg shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dot.png')] bg-repeat opacity-20"></div>
          
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,_#00f3ff_25%,_transparent_25%)_repeat_0_0] opacity-30 animate-lines"></div>

          <motion.h2
            className="relative text-4xl font-bold text-blue-700 mb-6 z-10"
            initial={{ opacity: 0, rotateX: -180 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            Nos Missions
          </motion.h2>

          <motion.p
            className="relative text-xl text-blue-700 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          >
            Grâce à notre application, les entreprises peuvent générer automatiquement leur DUERP. Nous nous engageons à actualiser en permanence nos bases de données pour une meilleure prévention des risques.
          </motion.p>
        </section>

        {/* Section 5 : Notre Vision */}
        <section className="relative p-8 rounded-lg shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dot.png')] bg-repeat opacity-20"></div>
          
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,_#00f3ff_25%,_transparent_25%)_repeat_0_0] opacity-30 animate-lines"></div>

          <motion.h2
            className="relative text-4xl font-bold text-blue-700 mb-6 z-10"
            initial={{ opacity: 0, rotateX: -180 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            Notre Vision
          </motion.h2>

          <motion.p
            className="relative text-lg text-blue-700 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          >
            Notre ambition est de devenir un acteur majeur dans l’évaluation et la gestion des risques en entreprise, en proposant également des services de consultance spécialisés.
          </motion.p>
        </section>

        <section className="relative p-8">
          <motion.h2
            className="text-3xl font-bold text-center text-blue-700 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Ensemble pour un avenir meilleur
          </motion.h2>

          <div className="flex justify-center space-x-4">
            {/* Personnes tenant la main - petit groupe */}
            <FaUserAlt className="text-4xl text-blue-500" />
            <FaUserFriends className="text-4xl text-blue-500" />
            <FaUserAlt className="text-4xl text-blue-500" />
            <FaUserFriends className="text-4xl text-blue-500" />
            <FaUserAlt className="text-4xl text-blue-500" />
          </div>
          
        </section>

      </div>
      
      <Footer />
    </div>
  );
}

