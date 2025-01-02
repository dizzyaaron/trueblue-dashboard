export interface NewClientFormData {
  title: string;
  firstName: string;
  lastName: string;
  companyName: string;
  useCompanyName: boolean;
  phones: Array<{
    type: string;
    number: string;
    receivesText: boolean;
  }>;
  emails: Array<{
    type: string;
    address: string;
  }>;
  property: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddressSameAsProperty: boolean;
  leadSource: string;
  automatedNotifications: boolean;
}