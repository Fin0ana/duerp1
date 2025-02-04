"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from '../../../../../components/AdminLayout';
import axiosInstance from "../../payment/utils/axios";

interface Sector {
  _id: string;
  name: string;
}

interface Domain {
  _id: string;
  name: string;
}

const SecteurPage: React.FC = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; // Nombre d'éléments par page

  // Récupération des secteurs
  const getSectors = async () => {
    try {
      const response = await axiosInstance.get("/api/sector?limit=100");
      const sortedSectors = response.data.data.sort((a: Sector, b: Sector) =>
        a.name.localeCompare(b.name) // Tri alphabétique
      );
      setSectors(sortedSectors);
    } catch (error) {
      console.error("Erreur lors de la récupération des secteurs :", error);
    }
  };

  // Récupération des domaines associés à un secteur
  const getDomains = async (sectorId: string) => {
    try {
      const response = await axiosInstance.get(
        `/api/domain/from-sector/${sectorId}`
      );
      setDomains(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des domaines :", error);
    }
  };

  useEffect(() => {
    getSectors();
  }, []);

  useEffect(() => {
    if (selectedSectorId) {
      getDomains(selectedSectorId);
    }
  }, [selectedSectorId]);

  // Logique de pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSectors = sectors.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sectors.length / itemsPerPage);

  return (
    <AdminLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "1rem" }}>Liste des Secteurs</h1>

        {/* Affichage des secteurs */}
        <ul style={{ padding: 0, marginBottom: "1rem" }}>
          {currentSectors.map((sector) => (
            <li
              key={sector._id}
              style={{
                margin: "0.5rem 0",
                cursor: "pointer",
                color: selectedSectorId === sector._id ? "#0A7075" : "#000",
                fontWeight: selectedSectorId === sector._id ? "bold" : "normal",
              }}
              onClick={() => setSelectedSectorId(sector._id)}
            >
              {sector.name}
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              color: currentPage === 1 ? "#ccc" : "#0A7075",
              marginRight: "1rem",
            }}
          >
            ◀
          </button>

          <span>
            Page {currentPage} sur {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              color: currentPage === totalPages ? "#ccc" : "#0A7075",
              marginLeft: "1rem",
            }}
          >
            ▶
          </button>
        </div>

        {/* Domaines associés */}
        {selectedSectorId && (
          <div style={{ marginTop: "2rem", textAlign: "left" }}>
            <h2>Domaines pour le secteur sélectionné :</h2>
            <ul>
              {domains.length > 0 ? (
                domains.map((domain) => (
                  <li key={domain._id} style={{ margin: "0.5rem 0" }}>
                    {domain.name}
                  </li>
                ))
              ) : (
                <p>Aucun domaine disponible pour ce secteur.</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SecteurPage;