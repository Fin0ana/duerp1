type Status = "active" | "pending" | "disabled" | "expired";
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
  companyId?: string;
};

type LoginParams = {
  username?: string;
  email?: string;
  password: string;
};

type RegisterParams = {
  firstName: string;
  name: string;
  username: string;
  email: string;
  password: string;
  inviteToken?: string;
  address?: string;
  phone?: string;
};

type InvitationGet = {
  _id: string;
  companyId: string;
  createdBy: string;
  email: string;
  role: "simple" | "moderator" | "admin";
  token: string;
  expiresAt: Date;
  status: "pending" | "used" | "expired";
  createdAt: string;
  text?: string;
  __v: number;
};

type InvitationPost = { email: string; role: string };
type Profile = {
  username: string;
  email: string;
  name: string;
  firstName?: string;
  status: Status;
  role: UserRole;
  companyId?: string;
  plan?: string;
  address?: string;
  phone?: string;
  company?: {
    name: string;
    description?: string;
    status: Status;
    postIds: string[];
    domainId?: {
      _id: string;
      name: string;
    };
    subDomainId?: {
      _id: string;
      name: string;
    };
    siren: string;
    siret?: string;
    category?: {
      _id: string;
      name: string;
      type: string;
      price: number;
    };
    classement?: string;
    expiresAt?: Date;
    address?: string;
    phone?: string;
  };
};
