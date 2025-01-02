import React, { useState } from 'react';
import { X, Plus, User, Home, Phone, Mail, MapPin } from 'lucide-react';
import { useCustomerStore } from '../../store/customerStore';
import SuccessCheckmark from '../animations/SuccessCheckmark';
import { useCapitalizedInput } from '../../hooks/useCapitalizedInput';
import type { NewClientFormData } from '../../types/forms';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (clientId: string) => void;
}

export default function NewClientModal({ isOpen, onClose, onSave }: Props) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { addCustomer } = useCustomerStore();
  const [formData, setFormData] = useState<NewClientFormData>({
    title: 'No title',
    firstName: '',
    lastName: '',
    companyName: '',
    useCompanyName: false,
    phones: [{ type: 'Main', number: '', receivesText: false }],
    emails: [{ type: 'Main', address: '' }],
    property: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    billingAddressSameAsProperty: true,
    leadSource: '',
    automatedNotifications: true,
  });

  const handleSave = async (createAnother: boolean = false) => {
    const clientId = addCustomer(formData);
    setShowSuccess(true);
    setSuccessMessage(createAnother ? 'Client saved! Creating another...' : 'Client saved successfully!');
    
    setTimeout(() => {
      setShowSuccess(false);
      
      if (createAnother) {
        setFormData({
          title: 'No title',
          firstName: '',
          lastName: '',
          companyName: '',
          useCompanyName: false,
          phones: [{ type: 'Main', number: '', receivesText: false }],
          emails: [{ type: 'Main', address: '' }],
          property: {
            street1: '',
            street2: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'United States'
          },
          billingAddressSameAsProperty: true,
          leadSource: '',
          automatedNotifications: true,
        });
        // Scroll form back to top
        const formElement = document.querySelector('.modal-form');
        if (formElement) {
          formElement.scrollTop = 0;
        }
      } else {
        onSave?.(clientId);
        onClose();
      }
    }, 2500);
  };

  const addPhone = () => {
    setFormData(prev => ({
      ...prev,
      phones: [...prev.phones, { type: 'Main', number: '', receivesText: false }]
    }));
  };

  const addEmail = () => {
    setFormData(prev => ({
      ...prev,
      emails: [...prev.emails, { type: 'Main', address: '' }]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-4xl relative text-white my-8">
        {showSuccess && <SuccessCheckmark message={successMessage} />}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">New Client</h2>
        </div>

        <form className="p-6 space-y-8 max-h-[calc(100vh-16rem)] overflow-y-auto modal-form">
          {/* Client Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Client details</h3>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-2">
                <select 
                  className="input-primary bg-gray-800 w-full"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                >
                  <option>No title</option>
                  <option>Mr.</option>
                  <option>Mrs.</option>
                  <option>Ms.</option>
                  <option>Dr.</option>
                </select>
              </div>
              <div className="col-span-5">
                <input
                  type="text"
                  placeholder="First name"
                  onChange={(e) => {
                    const words = e.target.value.split(' ');
                    const capitalized = words.map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    ).join(' ');
                    setFormData(prev => ({ ...prev, firstName: capitalized }));
                  }}
                  className="input-primary bg-gray-800 w-full"
                  value={formData.firstName}
                />
              </div>
              <div className="col-span-5">
                <input
                  type="text"
                  placeholder="Last name"
                  onChange={(e) => {
                    const words = e.target.value.split(' ');
                    const capitalized = words.map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    ).join(' ');
                    setFormData(prev => ({ ...prev, lastName: capitalized }));
                  }}
                  className="input-primary bg-gray-800 w-full"
                  value={formData.lastName}
                />
              </div>
            </div>

            <input
              type="text"
              placeholder="Company name"
              onChange={(e) => {
                const words = e.target.value.split(' ');
                const capitalized = words.map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ');
                setFormData(prev => ({ ...prev, companyName: capitalized }));
              }}
              className="input-primary bg-gray-800 w-full"
              value={formData.companyName}
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.useCompanyName}
                onChange={e => setFormData(prev => ({ ...prev, useCompanyName: e.target.checked }))}
                className="form-checkbox bg-gray-800"
              />
              <span className="text-sm">Use company name as the primary name</span>
            </label>
          </div>

          {/* Contact Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Details</h3>
            
            {/* Phone Numbers */}
            {formData.phones.map((phone, index) => (
              <div key={index} className="grid grid-cols-12 gap-4">
                <div className="col-span-2">
                  <select 
                    className="input-primary bg-gray-800 w-full"
                    value={phone.type}
                    onChange={e => {
                      const newPhones = [...formData.phones];
                      newPhones[index].type = e.target.value;
                      setFormData(prev => ({ ...prev, phones: newPhones }));
                    }}
                  >
                    <option>Main</option>
                    <option>Mobile</option>
                    <option>Work</option>
                    <option>Home</option>
                  </select>
                </div>
                <div className="col-span-8">
                  <input
                    type="tel"
                    placeholder="Phone number"
                    className="input-primary bg-gray-800 w-full"
                    value={phone.number}
                    onChange={e => {
                      const newPhones = [...formData.phones];
                      newPhones[index].number = e.target.value;
                      setFormData(prev => ({ ...prev, phones: newPhones }));
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={phone.receivesText}
                      onChange={e => {
                        const newPhones = [...formData.phones];
                        newPhones[index].receivesText = e.target.checked;
                        setFormData(prev => ({ ...prev, phones: newPhones }));
                      }}
                      className="form-checkbox bg-gray-800"
                    />
                    <span className="text-sm">Client Prefers Texts</span>
                  </label>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addPhone}
              className="text-primary hover:text-primary-dark flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Phone Number
            </button>

            {/* Email Addresses */}
            {formData.emails.map((email, index) => (
              <div key={index} className="grid grid-cols-12 gap-4">
                <div className="col-span-2">
                  <select 
                    className="input-primary bg-gray-800 w-full"
                    value={email.type}
                    onChange={e => {
                      const newEmails = [...formData.emails];
                      newEmails[index].type = e.target.value;
                      setFormData(prev => ({ ...prev, emails: newEmails }));
                    }}
                  >
                    <option>Main</option>
                    <option>Work</option>
                    <option>Personal</option>
                  </select>
                </div>
                <div className="col-span-10">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="input-primary bg-gray-800 w-full"
                    value={email.address}
                    onChange={e => {
                      const newEmails = [...formData.emails];
                      newEmails[index].address = e.target.value;
                      setFormData(prev => ({ ...prev, emails: newEmails }));
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addEmail}
              className="text-primary hover:text-primary-dark flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Email Address
            </button>
          </div>

          {/* Property Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Property Details</h3>
            </div>

            <input
              type="text"
              placeholder="Street 1"
              className="input-primary bg-gray-800 w-full"
              value={formData.property.street1}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                property: { ...prev.property, street1: e.target.value }
              }))}
            />

            <input
              type="text"
              placeholder="Street 2"
              className="input-primary bg-gray-800 w-full"
              value={formData.property.street2}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                property: { ...prev.property, street2: e.target.value }
              }))}
            />

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <input
                  type="text"
                  placeholder="City"
                  className="input-primary bg-gray-800 w-full"
                  value={formData.property.city}
                  onChange={e => setFormData(prev => ({ 
                    ...prev, 
                    property: { ...prev.property, city: e.target.value }
                  }))}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="State"
                  className="input-primary bg-gray-800 w-full"
                  value={formData.property.state}
                  onChange={e => setFormData(prev => ({ 
                    ...prev, 
                    property: { ...prev.property, state: e.target.value }
                  }))}
                />
              </div>
              <div className="col-span-4">
                <input
                  type="text"
                  placeholder="ZIP code"
                  className="input-primary bg-gray-800 w-full"
                  value={formData.property.zipCode}
                  onChange={e => setFormData(prev => ({ 
                    ...prev, 
                    property: { ...prev.property, zipCode: e.target.value }
                  }))}
                />
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.billingAddressSameAsProperty}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  billingAddressSameAsProperty: e.target.checked 
                }))}
                className="form-checkbox bg-gray-800"
              />
              <span className="text-sm">Billing address is the same as property address</span>
            </label>
            
            {!formData.billingAddressSameAsProperty && (
              <div className="mt-4 space-y-4 animate-slide-down">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  <Home className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Billing Address</h3>
                </div>
                <input
                  type="text"
                  placeholder="Street 1"
                  className="input-primary bg-gray-800 w-full"
                  value={formData.billing?.street1 || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    billing: { ...prev.billing, street1: e.target.value }
                  }))}
                />
                <input
                  type="text"
                  placeholder="Street 2"
                  className="input-primary bg-gray-800 w-full"
                  value={formData.billing?.street2 || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    billing: { ...prev.billing, street2: e.target.value }
                  }))}
                />
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <input
                      type="text"
                      placeholder="City"
                      className="input-primary bg-gray-800 w-full"
                      value={formData.billing?.city || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        billing: { ...prev.billing, city: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="State"
                      className="input-primary bg-gray-800 w-full"
                      value={formData.billing?.state || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        billing: { ...prev.billing, state: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="ZIP code"
                      className="input-primary bg-gray-800 w-full"
                      value={formData.billing?.zipCode || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        billing: { ...prev.billing, zipCode: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
        </form>
        
        <div className="p-6 border-t border-gray-700 bg-gray-900 sticky bottom-0">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => !showSuccess && onClose()}
              className="px-4 py-2 text-gray-400 hover:text-gray-300"
            >
              Cancel
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleSave(true)}
                disabled={showSuccess}
              >
                Save And Create Another
              </button>
              <button 
                type="button"
                onClick={() => handleSave(false)}
                className="btn-primary"
                disabled={showSuccess}
              >
                Save Client
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => !showSuccess && onClose()}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}