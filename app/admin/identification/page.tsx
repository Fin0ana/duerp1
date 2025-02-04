"use client";
import AdminLayout from '../../../components/AdminLayout'
import { useState, ChangeEvent, FormEvent } from "react";
import { FaSearch } from "react-icons/fa";

const Identification: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [siret, setSiret] = useState<string>("");
  const [domaineActivite, setDomaineActivite] = useState<string>("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSiretChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSiret(e.target.value);
  };

  const handleDomaineActiviteChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDomaineActivite(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ siret, domaineActivite });
  };

  return (
    <div>
      <AdminLayout>
        <div className="flex flex-col items-center text-center p-8 max-w-md mx-auto mt-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Identification des Utilisateurs
          </h1>
          <p className="text-gray-500 mb-5">
            Liste des utilisateurs enregistrés et leurs statuts
            d'identification.
          </p>

          <div className="relative w-full mb-5">
            <input
              type="text"
              className="w-full py-2 pl-10 pr-3 rounded-lg text-gray-700 border border-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Entrer numéro SIRET/SIRENE"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 text-lg" />
          </div>

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="siret"
                className="block text-left font-semibold text-gray-700 mb-1"
              >
                Numéro SIRET/SIRENE
              </label>
              <input
                type="text"
                id="siret"
                className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                value={siret}
                onChange={handleSiretChange}
                placeholder="Entrer numéro SIRET/SIRENE"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="domaineActivite"
                className="block text-left font-semibold text-gray-700 mb-1"
              >
                Domaine d'activité
              </label>
              <select
                id="domaineActivite"
                className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                value={domaineActivite}
                onChange={handleDomaineActiviteChange}
              >
                <option value="">Sélectionnez un domaine</option>
                <option value="informatique">Informatique</option>
                <option value="medecine">Médecine</option>
                <option value="education">Éducation</option>
                <option value="commerce">Commerce</option>
                <option value="industrie">Industrie</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition"
            >
              Soumettre
            </button>
          </form>
        </div>
      </AdminLayout>
    </div>
  );
};

export default Identification;