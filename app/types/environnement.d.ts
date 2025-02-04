type IdName = { _id: string; name: string };

type EnvironmentGet = {
  _id: string;
  name: string;
  description: string;
  categories: IdName[];
  __v: string;
  createdAt: string;
  updatedAt: string;
  risks?: {
    risk: IdName;
    severity: Level;
    likelihood: Level;
    name?: string;
  }[];
};
type EnvironmentPost = {
  name: string;
  description?: string;
  categoryIds: IdName[];
  risks?: {
    riskId: string;
    severity: Level;
    likelihood: Level;
    name?: string;
  }[];
};

type EnvironmentCategoryGet = {
  _id: string;
  name: string;
  description: string;
  __v: string;
  createdAt: string;
  updatedAt: string;
};
type EnvironmentCategoryPost = {
  name: string;
  description?: string;
};

type MultiSelect3LevelKey = "risk" | "environment" | "work";
type MultiSelect3LevelValue = {
  risk?: IdName;
  environment?: IdName;
  work?: IdName;
  severity: Level;
  likelihood: Level;
  name?: string;
};