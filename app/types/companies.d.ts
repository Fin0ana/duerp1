type CompanyGet = {
  _id: string;
  name: string;
  description?: string;
  status: Status;
  postIds: string[];
  domainId: string;
  subDomainId: string;
  domainName?: string;
  adminIds: string[];
  modIds: string[];
  userIds: string[];
  createdAt: string;
  updatedAt: string;
  siren?: string;
  siret?: string;
  category: string;
  classement?: string;
  __v?: number;
};

type MidCompanyPost = {
  name: string;
  description?: string;
  status: Status;
  postIds: string[];
  domainId?: string;
  subDomainId?: string;
  adminIds: string[];
  modIds: string[];
  userIds: string[];
  category: string;
  classement?: string;
  siren?: string;
  siret?: string;
};

type CompanyPost = {
  name: string;
  description?: string;
  status: Status;
  postIds: string[];
  domainId?: string;
  subDomainId?: string;
  diffAdmin: any;
  diffMod: any;
  diffUser: any;
  category: string;
  classement?: string;
  siren?: string;
  siret?: string;
};

type ClientCompanyPost = {
  name: string;
  description?: string;
  status: Status;
  siren: string;
  siret?: string;
  classement?: string;
};

type CompanySiretResponse = {
  header: {
    statut: number;
    message: string;
  };
  etablissement: {
    siren: string;
    nic: string;
    siret: string;
    statutDiffusionEtablissement: string;
    dateCreationEtablissement: string;
    trancheEffectifsEtablissement: string;
    anneeEffectifsEtablissement: string;
    activitePrincipaleRegistreMetiersEtablissement?: string;
    dateDernierTraitementEtablissement: string;
    etablissementSiege: boolean;
    nombrePeriodesEtablissement: number;
    uniteLegale: {
      etatAdministratifUniteLegale: string;
      statutDiffusionUniteLegale: string;
      dateCreationUniteLegale: string;
      categorieJuridiqueUniteLegale: string;
      denominationUniteLegale?: string;
      sigleUniteLegale?: string;
      denominationUsuelle1UniteLegale?: string;
      denominationUsuelle2UniteLegale?: string;
      denominationUsuelle3UniteLegale?: string;
      sexeUniteLegale: string;
      nomUniteLegale: string;
      nomUsageUniteLegale?: string;
      prenom1UniteLegale: string;
      prenom2UniteLegale: string;
      prenom3UniteLegale: string;
      prenom4UniteLegale?: string;
      prenomUsuelUniteLegale: string;
      pseudonymeUniteLegale?: string;
      activitePrincipaleUniteLegale: string;
      nomenclatureActivitePrincipaleUniteLegale: string;
      identifiantAssociationUniteLegale?: string;
      economieSocialeSolidaireUniteLegale?: string;
      societeMissionUniteLegale?: string;
      caractereEmployeurUniteLegale?: string;
      trancheEffectifsUniteLegale: string;
      anneeEffectifsUniteLegale: string;
      nicSiegeUniteLegale: string;
      dateDernierTraitementUniteLegale: string;
      categorieEntreprise: string;
      anneeCategorieEntreprise: string;
    };
    adresseEtablissement: {
      complementAdresseEtablissement?: string;
      numeroVoieEtablissement: string;
      indiceRepetitionEtablissement?: string;
      dernierNumeroVoieEtablissement?: string;
      indiceRepetitionDernierNumeroVoieEtablissement?: string;
      typeVoieEtablissement: string;
      libelleVoieEtablissement: string;
      codePostalEtablissement: string;
      libelleCommuneEtablissement: string;
      libelleCommuneEtrangerEtablissement?: string;
      distributionSpecialeEtablissement?: string;
      codeCommuneEtablissement: string;
      codeCedexEtablissement?: string;
      libelleCedexEtablissement?: string;
      codePaysEtrangerEtablissement?: string;
      libellePaysEtrangerEtablissement?: string;
      identifiantAdresseEtablissement?: string;
      coordonneeLambertAbscisseEtablissement?: string;
      coordonneeLambertOrdonneeEtablissement?: string;
    };
    adresse2Etablissement: {
      complementAdresse2Etablissement?: string;
      numeroVoie2Etablissement?: string;
      indiceRepetition2Etablissement?: string;
      typeVoie2Etablissement?: string;
      libelleVoie2Etablissement?: string;
      codePostal2Etablissement?: string;
      libelleCommune2Etablissement?: string;
      libelleCommuneEtranger2Etablissement?: string;
      distributionSpeciale2Etablissement?: string;
      codeCommune2Etablissement?: string;
      codeCedex2Etablissement?: string;
      libelleCedex2Etablissement?: string;
      codePaysEtranger2Etablissement?: string;
      libellePaysEtranger2Etablissement?: string;
    };
    periodesEtablissement: {
      dateFin?: string;
      dateDebut: string;
      etatAdministratifEtablissement: string;
      changementEtatAdministratifEtablissement: boolean;
      enseigne1Etablissement?: string;
      enseigne2Etablissement?: string;
      enseigne3Etablissement?: string;
      changementEnseigneEtablissement: boolean;
      denominationUsuelleEtablissement?: string;
      changementDenominationUsuelleEtablissement: boolean;
      activitePrincipaleEtablissement: string;
      nomenclatureActivitePrincipaleEtablissement: string;
      changementActivitePrincipaleEtablissement: boolean;
      caractereEmployeurEtablissement: string;
      changementCaractereEmployeurEtablissement: boolean;
    }[];
  };
};

type CompanySirenResponse = {
  header: {
    statut: 200;
    message: string;
  };
  uniteLegale: {
    siren: string;
    statutDiffusionUniteLegale?: string;
    dateCreationUniteLegale?: string;
    sigleUniteLegale?: string;
    sexeUniteLegale?: string;
    prenom1UniteLegale?: string;
    prenom2UniteLegale?: string;
    prenom3UniteLegale?: string;
    prenom4UniteLegale?: string;
    prenomUsuelUniteLegale?: string;
    pseudonymeUniteLegale?: string;
    identifiantAssociationUniteLegale?: string;
    trancheEffectifsUniteLegale?: string;
    anneeEffectifsUniteLegale?: string;
    dateDernierTraitementUniteLegale?: string;
    nombrePeriodesUniteLegale: 3;
    categorieEntreprise?: string;
    anneeCategorieEntreprise?: string;
    periodesUniteLegale: {
      dateFin?: string;
      dateDebut?: string;
      etatAdministratifUniteLegale?: string;
      changementEtatAdministratifUniteLegale: boolean;
      nomUniteLegale?: string;
      changementNomUniteLegale: boolean;
      nomUsageUniteLegale?: string;
      changementNomUsageUniteLegale: boolean;
      denominationUniteLegale?: string;
      changementDenominationUniteLegale: boolean;
      denominationUsuelle1UniteLegale?: string;
      denominationUsuelle2UniteLegale?: string;
      denominationUsuelle3UniteLegale?: string;
      changementDenominationUsuelleUniteLegale: boolean;
      categorieJuridiqueUniteLegale?: string;
      changementCategorieJuridiqueUniteLegale: boolean;
      activitePrincipaleUniteLegale?: string;
      nomenclatureActivitePrincipaleUniteLegale?: string;
      changementActivitePrincipaleUniteLegale: boolean;
      nicSiegeUniteLegale?: string;
      changementNicSiegeUniteLegale: boolean;
      economieSocialeSolidaireUniteLegale?: string;
      changementEconomieSocialeSolidaireUniteLegale: boolean;
      societeMissionUniteLegale?: string;
      changementSocieteMissionUniteLegale: boolean;
      caractereEmployeurUniteLegale?: string;
      changementCaractereEmployeurUniteLegale: boolean;
    }[];
  };
};

type WorkForCompany = { workId: string; postId: string };
type WorkForCompanyDiff = {
  added: WorkForCompany[];
  removed: WorkForCompany[];
};
type RiskForCompany = { workId: string; riskId: string };
type RiskForCompanyDiff = {
  added: RiskForCompany[];
  removed: RiskForCompany[];
};

type MeasureForCompany = { measureId: string; riskId: string };
type MeasureForCompanyDiff = {
  added: MeasureForCompany[];
  removed: MeasureForCompany[];
};

type CompanyDomain = {
  _id: string;
  name: string;
  keywords: string[];
  equivalent: string[];
};
