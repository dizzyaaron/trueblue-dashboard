export interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Quote {
  id: string;
  customerId: string;
  jobTitle: string;
  opportunity: number;
  lineItems: LineItem[];
  clientMessage: string;
  disclaimer: string;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}