


'use client'

import Navbar from '@/components/Navbar';
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from '@/components/FooterUser';
import { FaUser, FaStickyNote, FaBullseye } from 'react-icons/fa'; 
import { FaUserFriends, FaUserAlt } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Image de fond en PLEIN ÉCRAN */}
      <section className="relative w-screen h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src="/assets/fond4.jpg"
            alt="Entreprise"
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
        </motion.div>

        {/* Texte CENTRÉ SUR L'IMAGE avec MEILLEUR CONTRASTE */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 p-6">
          <p className="text-white text-4xl font-bold text-center max-w-3xl">
            <span className="text-blue-400">Fondée en 2024</span>,  
            <span className="font-extrabold"> DUERP en ligne</span> simplifie la gestion des risques
            en centralisant les informations et en automatisant la création de documents conformes.
          </p>
        </div>
      </section>

      {/* AUTRES SECTIONS BIEN ALIGNÉES */}
      <div className="w-screen px-12 py-16 space-y-16">
        
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 p-12">
  {/* Card : Notre Motivation */}
  <motion.div
    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-2xl shadow-xl text-white flex-1 max-w-md h-full flex flex-col justify-between"
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: 'easeOut' }}
  >
    <h2 className="text-3xl font-bold mb-4 text-center">Notre Motivation</h2>
    <p className="text-lg text-justify px-6">
      Notre ambition est de devenir le leader de la prévention des risques afin d'aider les entreprises à assurer la sécurité de leurs employés.
    </p>
  </motion.div>

  {/* Card : Nos Objectifs */}
  <motion.div
    className="p-8 bg-white shadow-xl rounded-2xl flex-1 max-w-md h-full flex flex-col justify-between"
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.2, ease: 'easeOut' }}
  >
    <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">Nos Objectifs</h2>
    <ul className="list-none space-y-3 text-lg text-gray-800 px-6 text-justify">
      <li><FaBullseye className="inline-block text-blue-500 mr-2" /> Améliorer l’expérience utilisateur</li>
      <li><FaBullseye className="inline-block text-blue-500 mr-2" /> Élargir notre réseau en France et à l’international</li>
      <li><FaBullseye className="inline-block text-blue-500 mr-2" /> Développer un service innovant et efficace</li>
    </ul>
  </motion.div>

  {/* Card : Notre Vision */}
  <motion.div
    className="p-8 bg-gray-200 shadow-xl rounded-2xl flex-1 max-w-md h-full flex flex-col justify-between"
    initial={{ opacity: 0, rotateX: -180 }}
    animate={{ opacity: 1, rotateX: 0 }}
    transition={{ duration: 1.4, ease: 'easeOut' }}
  >
    <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">Notre Vision</h2>
    <p className="text-lg text-blue-700 text-justify px-6">
      Notre ambition est de devenir un acteur majeur dans l’évaluation et la gestion des risques en entreprise.
    </p>
  </motion.div>
</div>


        {/* Section : Ensemble pour un avenir meilleur */}
        <section className="p-12 text-center">
          <motion.h2
            className="text-3xl font-bold text-blue-700 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Ensemble pour un avenir meilleur
          </motion.h2>

          <div className="flex justify-center space-x-4">
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
