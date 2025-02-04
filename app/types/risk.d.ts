type RiskCategoryGet = {
  _id: string;
  name: string;
  description: string;
  keywords?: string[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

type RiskCategoryPost = {
  name: string;
  description: string;
  keywords?: string[];
};

type RiskSeverity = "low" | "medium" | "high" | "critical";
type Likelihood = "low" | "medium" | "high" | "critical";
type RiskSeverityNumber = 2 | 3 | 4 | 5 | 6;
type MissingLevelType = "domain" | "work";

type RiskSeverityOption = { label: string; value: RiskSeverity };

type WorkRisk = {
  severity: Level;
  likelihood: Level;
  name?: string;
  work?: {
    _id: string;
    name: string;
  };
};

type RiskGet = {
  _id: string;
  name: string;
  description: string;
  keywords?: string[];
  severity: RiskSeverity;
  likelihood: Likelihood;
  domainId: string;
  riskCategoryId?: string;
  createdAt: string;
  updatedAt: string;
  workId?: string[];
  works?: WorkRisk[];
  __v?: number;
};

type RiskPost = {
  name: string;
  description: string;
  keywords?: string[];
  severity: RiskSeverity;
  likelihood: Likelihood;
  domainId: string;
  riskCategoryId?: string;
  workId?: string[];
  works?: {
    workId: string;
    severity: Level;
    likelihood: Level;
    name?: string;
  }[];
};

type RiskCoordinate = {
  severity: number;
  likelihood: number;
};
type MeasureGet = {
  _id: string;
  name: string;
  description: string;
  keywords?: string[];
  riskId: string;
  createdAt: string;
  updatedAt: string;
  for?: RiskCoordinate[];
  __v?: number;
};

type MeasurePost = {
  name: string;
  description: string;
  keywords?: string[];
  riskId: string;
  for?: RiskCoordinate[];
};

type RiskChecking = {
  risk: { id: string; name: string };
  measures: SelectedWorks[];
};
