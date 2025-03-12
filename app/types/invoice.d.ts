type InvoiceClient = {
  name: string;
  email: string;
  address: string;
  phone: string;
  siren: string;
  siret: string;
};

type InvoiceGet = {
  _id: string;
  name: string;
  amount: number;
  createdAt: string;
  invoiceNumber: string;
  client?: InvoiceClient;
};
