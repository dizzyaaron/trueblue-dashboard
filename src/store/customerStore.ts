import { create } from 'zustand';
import { Customer } from '../types';
import { NewClientFormData } from '../types/forms';
import { saveClient, updateClient, fetchClients, deleteClient } from '../lib/supabase/clients';

interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
  addCustomer: (formData: NewClientFormData) => Promise<string>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  fetchCustomers: () => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  isLoading: false,
  error: null,

  addCustomer: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const customer = {
        name: formData.useCompanyName ? formData.companyName : `${formData.firstName} ${formData.lastName}`,
        email: formData.emails[0]?.address || '',
        phone: formData.phones[0]?.number || '',
        address: `${formData.property.street1}${formData.property.street2 ? ', ' + formData.property.street2 : ''}, ${formData.property.city}, ${formData.property.state} ${formData.property.zipCode}`,
        notes: '',
        created_at: new Date().toISOString(),
        last_contact_date: new Date().toISOString()
      };
      
      const savedCustomer = await saveClient(customer);
      set(state => ({ 
        customers: [savedCustomer, ...state.customers],
        isLoading: false 
      }));
      return savedCustomer.id;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateCustomer: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCustomer = await updateClient(id, updates);
      set(state => ({
        customers: state.customers.map(customer => 
          customer.id === id ? { ...customer, ...updatedCustomer } : customer
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteClient(id);
      set(state => ({
        customers: state.customers.filter(customer => customer.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const clients = await fetchClients();
      set({ customers: clients, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  }
}));