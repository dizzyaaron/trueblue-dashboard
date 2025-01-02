import React, { useState } from 'react';
import { Search, Plus, Filter, ArrowUp, Wrench, ClipboardList } from 'lucide-react';
import NewRequestModal from '../components/modals/NewRequestModal';
import RequestViewerModal from '../components/modals/RequestViewerModal';
import { useRequestStore } from '../store/requestStore';
import { useCustomerStore } from '../store/customerStore';

export default function Requests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const { requests } = useRequestStore();
  const { customers } = useCustomerStore();

  // Calculate stats
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  
  const newRequests = requests.filter(request => 
    new Date(request.createdAt) > last30Days
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Requests</h1>
        <div className="flex gap-2">
          <button 
            className="btn-primary" 
            onClick={() => setIsNewRequestModalOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2 inline-block" />
            New Request
          </button>
          <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
            More Actions
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 relative">
          <h3 className="text-lg font-bold text-white mb-1">New Requests</h3>
          <p className="text-sm text-gray-400 mb-2">Past 30 days</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{newRequests}</span>
            <span className="text-sm text-green-500 flex items-center">
              <ArrowUp className="w-4 h-4" />
              100%
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <ClipboardList className="w-6 h-6 text-[#F2A900]" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 relative">
          <h3 className="text-lg font-bold text-white mb-1">Overview</h3>
          <p className="text-sm text-gray-400 mb-2">Current status</p>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-white">New ({requests.length})</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span className="text-white">Complete (0)</span>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <Wrench className="w-6 h-6 text-[#F2A900]" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-bold text-white mb-1">Conversion Rate</h3>
          <p className="text-sm text-gray-400 mb-2">Past 30 days</p>
          <div>
            <span className="text-2xl font-bold text-white">0%</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 relative">
          <h3 className="text-sm font-medium text-white">Request Alerts</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-yellow-400">Follow-up Required</span>
              <span className="text-gray-400">Bob Smith</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-400">Overdue Assessment</span>
              <span className="text-gray-400">Jane Doe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">All requests</h2>
            <span className="text-sm text-gray-400">({requests.length} results)</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-white bg-gray-700 rounded-lg">All</button>
              <button className="px-3 py-1 text-gray-400 hover:bg-gray-700 rounded-lg">Clear filters</button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Client</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Title</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Property</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Contact</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Requested</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => {
                const client = customers.find(c => c.id === request.clientId);
                return (
                  <tr 
                    key={request.id} 
                    onClick={() => setSelectedRequest(request)}
                    className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{client?.name}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{request.title}</td>
                    <td className="py-3 px-4 text-gray-300">{client?.address}</td>
                    <td className="py-3 px-4">
                      <div className="text-gray-300">{client?.phone}</div>
                      <div className="text-gray-400 text-sm">{client?.email}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {new Date(request.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm">
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <NewRequestModal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
        onSave={(requestId) => {
          console.log('New request saved:', requestId);
          setIsNewRequestModalOpen(false);
        }}
      />
      {selectedRequest && (
        <RequestViewerModal
          isOpen={true}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
        />
      )}
    </div>
  );
}