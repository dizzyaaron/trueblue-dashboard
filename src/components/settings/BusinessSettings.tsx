import React, { useState } from 'react';
import { Building2, MapPin, Phone, Mail, Save, Edit2 } from 'lucide-react';

export default function BusinessSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Rapid City Home Repairs',
    address: '123 Main St',
    city: 'Rapid City',
    state: 'SD',
    zip: '57701',
    phone: '(605) 123-4567',
    email: 'contact@rapidcityhomerepairs.com'
  });
  const [tempInfo, setTempInfo] = useState(businessInfo);

  const handleSave = () => {
    setBusinessInfo(tempInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempInfo(businessInfo);
    setIsEditing(false);
  };

  const renderField = (label: string, value: string, icon: React.ReactNode) => (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <span className="text-sm text-gray-500">{label}</span>
        <p className="font-medium dark:text-dark-text">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold dark:text-dark-text">Business Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-text">
                Business Name
              </label>
              <input
                type="text"
                value={tempInfo.name}
                onChange={(e) => setTempInfo({ ...tempInfo, name: e.target.value })}
                className="input-primary dark:bg-gray-800 dark:text-dark-text"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-dark-text">
                  Address
                </label>
                <input
                  type="text"
                  value={tempInfo.address}
                  onChange={(e) => setTempInfo({ ...tempInfo, address: e.target.value })}
                  className="input-primary dark:bg-gray-800 dark:text-dark-text"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={tempInfo.city}
                  onChange={(e) => setTempInfo({ ...tempInfo, city: e.target.value })}
                  className="input-primary dark:bg-gray-800 dark:text-dark-text"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={tempInfo.state}
                  onChange={(e) => setTempInfo({ ...tempInfo, state: e.target.value })}
                  className="input-primary dark:bg-gray-800 dark:text-dark-text"
                />
                <input
                  type="text"
                  placeholder="ZIP"
                  value={tempInfo.zip}
                  onChange={(e) => setTempInfo({ ...tempInfo, zip: e.target.value })}
                  className="input-primary dark:bg-gray-800 dark:text-dark-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-dark-text">
                  Phone
                </label>
                <input
                  type="tel"
                  value={tempInfo.phone}
                  onChange={(e) => setTempInfo({ ...tempInfo, phone: e.target.value })}
                  className="input-primary dark:bg-gray-800 dark:text-dark-text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-dark-text">
                  Email
                </label>
                <input
                  type="email"
                  value={tempInfo.email}
                  onChange={(e) => setTempInfo({ ...tempInfo, email: e.target.value })}
                  className="input-primary dark:bg-gray-800 dark:text-dark-text"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {renderField('Business Name', businessInfo.name, <Building2 className="w-5 h-5 text-gray-400" />)}
            {renderField(
              'Address',
              `${businessInfo.address}, ${businessInfo.city}, ${businessInfo.state} ${businessInfo.zip}`,
              <MapPin className="w-5 h-5 text-gray-400" />
            )}
            {renderField('Phone', businessInfo.phone, <Phone className="w-5 h-5 text-gray-400" />)}
            {renderField('Email', businessInfo.email, <Mail className="w-5 h-5 text-gray-400" />)}
          </div>
        )}
      </div>
    </div>
  );
}