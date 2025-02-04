'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  FaUser,
  FaDollarSign,
  FaSignOutAlt,
  FaCaretDown,
  FaCaretRight,
  FaDatabase,
  FaTools,
  FaFolderOpen,
  FaLock,
  FaList,
  FaShieldAlt,
} from 'react-icons/fa';

const AdminSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isCompteOpen, setIsCompteOpen] = useState<boolean>(false);
  const [isDomaineOpen, setIsDomaineOpen] = useState<boolean>(false);
  const [isDuerpOpen, setIsDuerpOpen] = useState<boolean>(false);

  return (
    <div className="flex">
      {/* Barre latérale fixe */}
      <div
        className={`h-screen p-4 ${
          isOpen ? 'w-64' : 'w-20'
        } bg-gray-800 text-white fixed top-0 left-0 duration-300`}
      >
        {/* Logo */}
        <div className="flex justify-between items-center mb-6">
          <Image
            src="/assets/logo.png"
            alt="Admin Logo"
            width={isOpen ? 150 : 50}
            height={50}
          />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none text-white"
          >
            {isOpen ? '<' : '>'}
          </button>
        </div>

        {/* Navigation */}
        <nav>
          <ul>
            {/* Identification */}
            <li className="mb-4">
              <Link
                href="/admin/identification"
                className="flex items-center text-lg hover:bg-gray-700 px-4 py-2 rounded-md"
              >
                <FaUser className="mr-3" />
                {isOpen && 'Identification'}
              </Link>
            </li>

            {/* Compte */}
            <li className="mb-4">
              <button
                className="flex items-center text-lg hover:bg-gray-700 px-4 py-2 rounded-md w-full"
                onClick={() => setIsCompteOpen(!isCompteOpen)}
              >
                <FaLock className="mr-3" />
                {isOpen && 'Compte'}
                <span className="ml-auto">
                  {isOpen && (isCompteOpen ? <FaCaretDown /> : <FaCaretRight />)}
                </span>
              </button>
              {isCompteOpen && (
                <ul className="ml-8">
                  <li className="mb-2">
                    <Link
                      href="/admin/compte/login"
                      className="flex items-center text-lg hover:bg-gray-700 px-4 py-2 rounded-md"
                    >
                      <FaUser className="mr-3" />
                      {isOpen && 'Login'}
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/admin/compte/register"
                      className="flex items-center text-lg hover:bg-gray-700 px-4 py-2 rounded-md"
                    >
                      <FaUser className="mr-3" />
                      {isOpen && 'Register'}
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Domaine */}
            <li className="mb-4">
              <button
                className="flex items-center text-lg hover:bg-gray-700 px-4 py-2 rounded-md w-full"
                onClick={() => setIsDomaineOpen(!isDomaineOpen)}
              >
                <FaFolderOpen className="mr-3" />
                {isOpen && 'Domaine/Secteur'}
                <span className="ml-auto">
                  {isOpen && (isDomaineOpen ? <FaCaretDown /> : <FaCaretRight />)}
                </span>
              </button>
              {isDomaineOpen && (
                <ul className="ml-8">
                  <li className="mb-2">
                    <Link
                      href="/admin/domaine/secteur"
                      className="flex items-center text-lg hover:bg-gray-700 px-4 py-2 rounded-md"
                    >
                      <FaDatabase className="mr-3" />
                      {isOpen && "Secteur d'Activité"}
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/admin/domaine/domaine"
                      className="flex items-center text-lg hover:bg-gray-700 px-4 py-2 rounded-md"
                    >
                      <FaDatabase className="mr-3" />
                      {isOpen && "Domaine d'Activité"}
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/admin/domaine/sousdomaine"
                      className="flex items-center text-lg hover:bg-gray-700 px-4 py-2 rounded-md"
                    >
                      <FaTools className="mr-3" />
                      {isOpen && 'Sous-domaine'}
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* DUERP */}
            <li className="mb-4">
              <button
                className="flex items-center text-lg hover:bg-gray-700 px-4 py-2 rounded-md w-full"
                onClick={() => setIsDuerpOpen(!isDuerpOpen)}
              >
                <FaDatabase className="mr-3" />
                {isOpen && 'DUERP'}
                <span className="ml-auto">
                  {isOpen && (isDuerpOpen ? <FaCaretDown /> : <FaCaretRight />)}
                </span>
              </button>
              {isDuerpOpen && (
                <ul className="ml-8">
                  <li className="mb-2">
                    <Link
                      href="/admin/duerp/poste"
                      className="flex items-center text-lg hover:bg-gray-700 px-4 py-2 rounded-md"
                    >
                      <FaUser className="mr-3" />
                      {isOpen && 'Poste'}
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/admin/duerp/tache"
                      className="flex items-center text-lg hover:bg-gray-700 px-4 py-2 rounded-md"
                    >
                      <FaList className="mr-3" />
                      {isOpen && 'Tâche'}
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/admin/duerp/risque"
                      className="flex items-center text-lg hover:bg-gray-700 px-4 py-2 rounded-md"
                    >
                      <FaList className="mr-3" />
                      {isOpen && 'Risque'}
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/admin/duerp/prevention"
                      className="flex items-center text-lg hover:bg-gray-700 px-4 py-2 rounded-md"
                    >
                      <FaShieldAlt className="mr-3" />
                      {isOpen && 'Prévention'}
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Déconnexion */}
            <li>
              <Link
                href="/admin/deconnexion"
                className="flex items-center text-lg hover:bg-gray-700 px-4 py-2 rounded-md"
              >
                <FaSignOutAlt className="mr-3" />
                {isOpen && 'Déconnexion'}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* Contenu principal */}
      <div className={`ml-${isOpen ? 64 : 20} w-full p-4`}>
        {/* Votre contenu ici */}
        <h1>Bienvenue dans l'administration</h1>
      </div>
    </div>
  );
}

export default AdminSidebar;