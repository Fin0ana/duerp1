"use client";
import React, { useState, useEffect } from "react";
import AdminLayout from '../../../../components/AdminLayout';
import axiosInstance from "../../payment/utils/axios";

const Secteur: React.FC = () => {
  const [sectors, setSectors] = useState<any[]>([]); // Liste des secteurs
  const [domains, setDomains] = useState<any[]>([]); // Liste des domaines pour le secteur sélectionné
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null); // Secteur sélectionné
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; // Nombre d'éléments par page

  const handleClick = async () => {
    // id: ilay id an'ny domain na subdomain sélectionné
    // type na "subdomain" na "domain"
    if (!id) return;
    await axiosInstance.put("/api/companies/client", { id, type: domainType });
  };

  // Récupération des secteurs
  const getSectors = async () => {
    try {
      const response = await axiosInstance.get("/api/sector?limit=100");
      const sortedSectors = response.data.data.sort((a: any, b: any) =>
        a.name.localeCompare(b.name) // Tri alphabétique
      );
      setSectors(sortedSectors);
    } catch (error) {
      console.error("Erreur lors de la récupération des secteurs :", error);
    }
  };

  // Récupération des domaines pour un secteur donné
  const getDomains = async (sectorId: string) => {
    try {
      const response = await axiosInstance.get(`/api/domain/from-sector/${sectorId}`);
      setDomains(response.data); // Mise à jour des domaines
    } catch (error) {
      console.error(`Erreur lors de la récupération des domaines pour le secteur ${sectorId} :`, error);
    }
  };

  useEffect(() => {
    getSectors();
  }, []);

  // Logique de pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSectors = sectors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sectors.length / itemsPerPage);

  const [subDomains, setSubDomains] = useState<any[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<string | undefined>();
  const [domainType, setDomainType] = useState<"domain" | "subdomain">("domain");

  const clickDomain = (domainId: string) => async () => {
    const response = await axiosInstance.get(`/api/sub-domain/from-domain/${domainId}`);
    setSelectedDomainId(domainId);
    setSubDomains(response.data);
    setSelectedSubDomainId("");
    if (response.data.length === 0) return setDomainType("domain");
    setDomainType("subdomain");
  };

  const [selectedSubDomainId, setSelectedSubDomainId] = useState<string | undefined>();
  const clickSubDomain = (subDomainId: string) => () => {
    setSelectedSubDomainId(subDomainId);
  };

  const id = domainType === "subdomain" ? selectedSubDomainId : selectedDomainId;

  return (
    <AdminLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ marginBottom: "1rem" }}>Liste des Secteurs</h1>

        {/* Affichage des secteurs */}
        <ul style={{ padding: 0, marginBottom: "1rem", listStyle: "none" }}>
          {currentSectors.map((sector) => (
            <li key={sector._id} style={{ margin: "0.5rem 0" }}>
              <button
                onClick={() => {
                  setSelectedSectorId(sector._id);
                  getDomains(sector._id); // Récupérer les domaines
                }}
                style={{
                  backgroundColor: "#0A7075",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {sector.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div style={{ marginBottom: "2rem" }}>
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

        {/* Affichage des domaines pour le secteur sélectionné */}
        {selectedSectorId && (
          <div>
            <h2 style={{ marginBottom: "1rem" }}>
              Domaines pour le secteur sélectionné
            </h2>
            {domains?.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {domains.map((domain) => (
                  <li
                    key={domain._id}
                    onClick={clickDomain(domain._id)}
                    style={{
                      margin: "0.5rem 0",
                      padding: "0.5rem",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }}
                  >
                    {domain.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun domaine trouvé pour ce secteur.</p>
            )}
          </div>
        )}

        <div>{subDomains?.length ? <div>
          {subDomains.map((subDomain) => (
            <div onClick={clickSubDomain(subDomain._id)} key={subDomain._id}>{subDomain.name}</div>
          ))}
        </div> : <></>}</div>
        {selectedSubDomainId} <br />
        {selectedDomainId} <br />
        {domainType}
        <button disabled={!id} onClick={handleClick}>Suivant</button>
      </div>
    </AdminLayout>
  );
};

export default Secteur;