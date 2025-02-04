type BackErrorGet = {
  _id: string;
  message: string;
  trace?: string;
  ip?: string;
  url: string;
  userId?: string;
  createdAt: string
  updatedAt: string
};
type FrontErrorGet = {
  _id: string;
  message: string;
  trace?: string;
  ip?: string;
  url: string;
  userId?: string;
  createdAt: string
  updatedAt: string
};
type FrontErrorPost = {
  message: string;
  trace?: string;
  ip?: string;
  url: string;
  userId?: string;
};
