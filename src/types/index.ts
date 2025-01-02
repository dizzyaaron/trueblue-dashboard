// Update Job interface to include new fields
export interface Job {
  id: string;
  customerId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  startDate: string;
  endDate: string;
  workingDays: number;
  location: string;
  price: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  lastContactDate?: string;
  requiresAttention?: {
    type: 'no_contact' | 'proposal_needed' | 'proposal_due' | 'follow_up';
    message: string;
  };
}

// Update Customer interface to include new fields
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
  lastContactDate?: string;
  requiresAttention?: boolean;
  status?: 'active' | 'inactive' | 'lead';
}

export interface Quote {
  id: string;
  customerId: string;
  title: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  lineItems: Array<{
    id: string;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  tax: number;
  taxEnabled: boolean;
  discount: number;
  total: number;
  requiredDeposit: number;
  clientMessage: string;
  disclaimer: string;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}
export interface Request {
  id: string;
  clientId: string;
  title: string;
  details: string;
  preferredDates: {
    primary: string;
    secondary: string;
  };
  preferredTimes: {
    anyTime: boolean;
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  requiresAssessment: boolean;
  internalNotes: string;
  status: 'new' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}