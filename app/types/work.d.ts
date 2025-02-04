type WorkSectorGet = {
  _id: string;
  name: string;
  description: string;
  keywords?: string[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
};
type WorkSectorPost = {
  name: string;
  description: string;
  keywords?: string[];
};

type WorkInDomain = {
  _id: string;
  name: string;
  domains: {
    domainId: string;
    level: Level;
    type: LevelType;
  }[];
};

type WorkDomainGet = {
  _id: string;
  name: string;
  description: string;
  keywords?: string[];
  sectorId: string[];
  createdAt: string;
  updatedAt: string;
  works: WorkInDomain[];
  suggestedPosts?: string[];
  __v?: number;
};
type WorkDomainPost = {
  name: string;
  description: string;
  keywords?: string[];
  suggestedPosts?: string[];
};

type WorkInSubDomain = {
  _id: string;
  name: string;
  subDomains: {
    subDomainId: string;
    level: Level;
    type: LevelType;
  }[];
};

type SubDomainGet = {
  _id: string;
  name: string;
  description: string;
  keywords?: string[];
  domainId: string;
  createdAt: string;
  updatedAt: string;
  works: WorkInSubDomain[];
  __v?: number;
  suggestedPosts?: string[];
};

type SubDomainPost = {
  name: string;
  description: string;
  keywords?: string[];
  domainId?: string;
  suggestedPosts?: string[];
};

type DomainInWork = { domainId: string; level: Level; type: LevelType };
type TypeCount = { severity: Level | 0; likelihood: Level | 0 };

type Level = 1 | 2 | 3;
type LevelType = "likelihood" | "severity";

const domainsIdList = [
  "sous-domainesSeverityHaut",
  "sous-domainesSeverityMoyen",
  "sous-domainesSeverityBas",
  "sous-domainesLikelihoodHaut",
  "sous-domainesLikelihoodMoyen",
  "sous-domainesLikelihoodBas",
  "domainesSeverityHaut",
  "domainesSeverityMoyen",
  "domainesSeverityBas",
  "domainesLikelihoodHaut",
  "domainesLikelihoodMoyen",
  "domainesLikelihoodBas",
] as const;

type DomainsIdList = (typeof domainsIdList)[number];
type WorkInPost<T = string> = { workId: T; level: Level; type: LevelType };
type PostGet<T = string> = {
  _id: string;
  name: string;
  description: string;
  keywords?: string[];
  works: WorkInPost<T>[];
  equivalent?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

type MidPostGet = {
  _id: string;
  name: string;
  description: string;
  keywords?: string[];
  worksLowSeverity?: string[];
  worksMidSeverity?: string[];
  worksHighSeverity?: string[];
  worksHighLikelihood?: string[];
  worksMidLikelihood?: string[];
  worksLowLikelihood?: string[];
  equivalent?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

type MidPostPost = {
  name: string;
  description: string;
  keywords?: string[];
  worksLowSeverity?: string[];
  worksMidSeverity?: string[];
  worksHighSeverity?: string[];
  worksHighLikelihood?: string[];
  worksMidLikelihood?: string[];
  worksLowLikelihood?: string[];
  equivalent?: string;
};

type PostPost = {
  name: string;
  description: string;
  keywords?: string[];
  works?: {
    workId: string;
    level: Level;
    type: LevelType;
  }[];
  equivalent?: string;
};

type RiskWork = {
  severity: Level;
  likelihood: Level;
  name?: string;
  risk?: {
    _id: string;
    name: string;
  };
};

type WorkGet = {
  _id: string;
  name: string;
  description: string;
  keywords?: string[];
  domains?: {
    domainId: string;
    level: Level;
    type: LevelType;
  }[];
  subDomains?: {
    subDomainId: string;
    level: Level;
    type: LevelType;
  }[];
  createdAt: string;
  updatedAt: string;
  posts?: {
    _id: string;
    name: string;
    works: {
      level: Level;
      workId: string;
      type: LevelType;
    }[];
  }[];
  risks?: RiskWork[];
  __v?: number;
};

type MidWorkGet = {
  [k in DomainsIdList]: string[] | undefined;
} & {
  _id: string;
  name: string;
  description: string;
  keywords?: string[];
  domainId?: string;
  subDomainId?: string;
  createdAt: string;
  updatedAt: string;
  postsHighSeverity?: string[];
  postsMidSeverity?: string[];
  postsLowSeverity?: string[];
  postsHighLikelihood?: string[];
  postsMidLikelihood?: string[];
  postsLowLikelihood?: string[];
  __v?: number;
};

type WorkPost = {
  name: string;
  description: string;
  keywords?: string[];
  domains?:
    | {
        domainId: string;
        level: Level;
        type: LevelType;
      }[]
    | null;
  subDomains?:
    | {
        subDomainId: string;
        level: Level;
        type: LevelType;
      }[]
    | null;
  posts?: {
    _id: string;
    works: {
      level: Level;
      type: LevelType;
    };
  }[];
};

type ComparablePost = { _id: string; level: Level; type: LevelType };

type ChangedWorkPost = WorkPost & {
  changes: {
    added: ComparablePost[];
    removed: ComparablePost[];
  };
};

type MidWorkPost = {
  [k in DomainsIdList]: string[] | undefined;
} & {
  name: string;
  description: string;
  keywords?: string[];
  domainId?: string | null;
  subDomainId?: string | null;
  postsHighSeverity?: string[];
  postsMidSeverity?: string[];
  postsLowSeverity?: string[];
  postsHighLikelihood?: string[];
  postsMidLikelihood?: string[];
  postsLowLikelihood?: string[];
};

type LabelValueLevel = { label: "Elevé" | "Moyen" | "Faible"; value: Level };
type MapLevel = {
  id: LevelType;
  key: "Severity" | "Likelihood";
  label: (k: string) => string;
  value: LabelValueLevel[];
};

type ArrayForMultiSelect = {
  id: DomainsIdList;
  label: string;
  section: string;
  level: Level;
  type: LevelType;
};

type DomainForClient = {
  _id: string;
  name: string;
  description?: string;
  domainId?: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
  __v: 0;
  suggestedPosts?: {
    equivalent: string[];
    _id: string;
    name: string;
    keywords: string[];
  }[];
};

type PostChecking = {
  post: { id: string; name: string };
  works: SelectedWorks[];
};

type SelectedWorks = {
  id: string;
  name: string;
  equivalent: string[];
  keywords: string[];
  checked: boolean;
  for?: MeasureFor[];
};

type WorkChecking = {
  work: { id: string; name: string };
  risks: SelectedWorks[];
};

type TreePostGet = {
  companyId: string;
  checked: any;
};
