type WorkPercentGet = {
  _id: string;
  companyId: Types.ObjectId;
  postId: Types.ObjectId;
  workId: Types.ObjectId;
  percent: number;
  status: "auto" | "manual";
  createdAt: string;
  updatedAt: string;
};
type WorkPercentPost = {
  companyId: Types.ObjectId;
  postId: Types.ObjectId;
  workId: Types.ObjectId;
  percent: number;
  status: "auto" | "manual";
};
