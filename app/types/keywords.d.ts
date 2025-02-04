type KeywordGet = {
  _id: string;
  name: string;
  synonyms?: string[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

type KeywordPost = {
  name: string;
  synonyms?: string[];
};
