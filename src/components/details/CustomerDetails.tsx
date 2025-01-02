import React from 'react';
import DetailSection from './DetailSection';
import DetailField from './DetailField';
import NotesSection from './NotesSection';
import { Customer } from '../../types';

interface CustomerDetailsProps {
  customer: Customer;
  onUpdate: (id: string, data: Partial<Customer>) => void;
  onAddNote: (note: string) => void;
}

export default function CustomerDetails({ 
  customer, 
  onUpdate,
  onAddNote 
}: CustomerDetailsProps) {
  const notes = customer.notes ? JSON.parse(customer.notes) : [];

  const handleSaveContact = (data: Partial<Customer>) => {
    onUpdate(customer.id, data);
  };

  const handleSaveAddress = (data: Partial<Customer>) => {
    onUpdate(customer.id, data);
  };

  return (
    <div className="space-y-6">
      <DetailSection title="Contact Information" onSave={handleSaveContact}>
        <DetailField label="Name" value={customer.name} />
        <DetailField label="Email" value={customer.email} type="email" />
        <DetailField label="Phone" value={customer.phone} type="tel" />
      </DetailSection>

      <DetailSection title="Address" onSave={handleSaveAddress}>
        <DetailField label="Street Address" value={customer.address} />
      </DetailSection>

      <NotesSection 
        notes={notes} 
        onAddNote={onAddNote}
      />
    </div>
  );
}