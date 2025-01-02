import { useEffect } from 'react';
import { useCustomerStore } from '../store/customerStore';

export function useCustomers() {
  const { customers, isLoading, error, fetchCustomers } = useCustomerStore();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return { customers, isLoading, error };
}