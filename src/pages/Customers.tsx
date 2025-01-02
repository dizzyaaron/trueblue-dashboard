import React, { useState } from 'react';
import { Search, Plus, Filter, ArrowUp } from 'lucide-react';
import { useCustomerStore } from '../store/customerStore';
import { useJobStore } from '../store/jobStore';
import NewClientModal from '../components/modals/NewClientModal';

export default function Customers() {
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { customers } = useCustomerStore();
  const { jobs } = useJobStore();

  // Calculate stats
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  
  const newLeads = customers.filter(customer => 
    new Date(customer.createdAt) > last30Days && customer.leadSource
  ).length;

  const newClients = customers.filter(customer => 
    new Date(customer.createdAt) > last30Days
  ).length;

  const totalNewClients = customers.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <div className="flex gap-2">
          <button 
            className="btn-primary"
            onClick={() => setIsNewClientModalOpen(true)}
          >
            New Client
          </button>
          <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
            More Actions
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm text-gray-400">New leads</h3>
          <p className="text-sm text-gray-400">Past 30 days</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-bold text-white">{newLeads}</span>
            <span className="text-sm text-green-500 flex items-center">
              <ArrowUp className="w-4 h-4" />
              100%
            </span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm text-gray-400">New clients</h3>
          <p className="text-sm text-gray-400">Past 30 days</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-bold text-white">{newClients}</span>
            <span className="text-sm text-green-500 flex items-center">
              <ArrowUp className="w-4 h-4" />
              100%
            </span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm text-gray-400">Total new clients</h3>
          <p className="text-sm text-gray-400">Year to date</p>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">{totalNewClients}</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white">Customer Alerts</h3>
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-yellow-400">Follow-up Required</span>
              <span className="text-gray-400">Bob Smith</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-400">Payment Overdue</span>
              <span className="text-gray-400">Jane Doe</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-400">Quote Pending</span>
              <span className="text-gray-400">Acme Corp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtered Clients Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            Filtered clients
            <span className="text-sm text-gray-400">({customers.length} results)</span>
          </h2>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search filtered clients..."
                className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              <span>Tags</span>
              <Plus className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-white">
              Status | Leads and Active
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Address</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Tags</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-white">{customer.name}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{customer.address}</td>
                  <td className="py-3 px-4 text-gray-300">-</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onSave={(clientId) => {
          console.log('New client saved:', clientId);
          setIsNewClientModalOpen(false);
        }}
      />
    </div>
  );
}