export const DEFAULT_CURRENT_USER: CurrentUser = {
  _id: "",
  username: "",
  name: "",
  firstName: "",
  email: "",
  password: "",
  role: "simple",
  status: "pending",
  createdAt: "",
  updatedAt: "",
  __v: 0,
  accessToken: "",
  companyId: "",
};

export const COOKIES_DURATION = 30 * 24 * 60 * 60 * 1000;

export const MAX_COOKIES_DURATION = 1 * 365 * 24 * 60 * 60 * 1000;
