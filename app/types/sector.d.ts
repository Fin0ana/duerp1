interface SousDomaineOption {
  domaine: string;
  sousDomaines: string[];
}

interface SecteurOption {
  secteur: string;
  domaines: SousDomaineOption[];
}
