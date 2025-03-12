type WorkPercentGet = {
  _id?: string;
  companyId?: string;
  postId: string;
  workId: string;
  percent: number;
  status: "auto" | "manual";
  createdAt?: string;
  updatedAt?: string;
};
type WorkPercentPost = {
  postId: string;
  workId: string;
  percent: number;
  status: "auto" | "manual";
};

type WorkPercentRecords = Record<string, WorkPercentGet[]>;
