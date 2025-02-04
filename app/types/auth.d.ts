type Status = "active" | "pending" | "disabled";
type PricingPlans = "tpe" | "pme" | "ge" | "group";
type UserRole =
  | "superadmin"
  | "supermoderator"
  | "admin"
  | "moderator"
  | "simple";

type CurrentUser = {
  _id: string;
  username: string;
  email: string;
  name: string;
  firstName: string;
  role: UserRole;
  status: Status;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  accessToken: string;
  companyId?: string
};

type LoginParams = {
  username: string;
  password: string;
};

type RegisterParams = {
  firstName: string;
  name: string;
  username: string;
  email: string;
  password: string;
};
