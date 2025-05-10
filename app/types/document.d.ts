type MinimalTreeNode = {
  name: string;
  severity?: number;
  likelihood?: number;
  children?: MinimalTreeNode[];
};
type DuerpHistory = {
  _id: string;
  company: string;
  version: number;
  siren: string;
  siret: string;
  category: string;
  classement: string;
  date: string;
  domain: string;
  companyId: string;
};

type DuerpHistoryDetails = {
  _id: string;
  company: string;
  version: number;
  siren: string;
  siret: string;
  category: string;
  classement: string;
  date: string;
  domain: string;
  companyId: string;
  duerp: MinimalTreeNode[];
};
