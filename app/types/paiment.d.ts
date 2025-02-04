type PricingGet = {
  _id: string;
  name: string;
  type: string;
  price: number;
  additionnal?: PricingAdditionnal[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
};
type PricingPost = {
  name: string;
  type: string;
  price: number;
  additionnal?: PricingAdditionnal[];
};

type PricingAdditionnal = {
  value: string;
  active: boolean;
};

type PaymentHistoryGet = {
  _id: string;
  userId: Types.ObjectId;
  amount: number;
  status: "succeed" | "pending" | "failed";
  stripePaymentId?: string;
  stripeCustomerId?: string;
  currency?: string;
  paymentMethod?: string[];
  receiptUrl?: string;
  failureMessage?: string;
  paymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};
