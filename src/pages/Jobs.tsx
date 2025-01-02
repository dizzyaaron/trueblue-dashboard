import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, Clock, CheckCircle, AlertCircle, MoreVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { useJobStore } from '../store/jobStore';
import { useCustomerStore } from '../store/customerStore';
import { statusColors } from '../constants/status';
import NewJobModal from '../components/NewJobModal';
import JobDetails from '../components/JobDetails';
import { Job } from '../types';
import StatusIndicator from '../components/StatusIndicator';

const jobStatuses = [
  'LEAD - Not Contacted',
  'Initial Contact Made',
  'Awaiting Response',
  'Quote Sent',
  'Quote Accepted',
  'Scheduled',
  'In Progress',
  'On Hold',
  'Completed',
  'Cancelled',
  'Follow-up Required'
];

type SortField = 'title' | 'customer' | 'status' | 'scheduledDate' | 'price';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export default function Jobs() {
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'title', direction: 'asc' });
  
  const { jobs } = useJobStore();
  const { customers } = useCustomerStore();

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      const customer = customers.find(c => c.id === job.customerId);
      const searchString = `${job.title} ${customer?.name} ${job.description}`.toLowerCase();
      const matchesSearch = searchString.includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(job.status);
      const matchesPrice = (!priceRange.min || job.price >= Number(priceRange.min)) &&
                          (!priceRange.max || job.price <= Number(priceRange.max));
      
      return matchesSearch && matchesStatus && matchesPrice;
    });

    return filtered.sort((a, b) => {
      const customer1 = customers.find(c => c.id === a.customerId)?.name || '';
      const customer2 = customers.find(c => c.id === b.customerId)?.name || '';
      
      let comparison = 0;
      switch (sortConfig.field) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'customer':
          comparison = customer1.localeCompare(customer2);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'scheduledDate':
          comparison = new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
      }
      
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [jobs, customers, searchQuery, statusFilter, priceRange, sortConfig]);

  const pendingJobs = jobs.filter(job => job.status === 'pending').length;
  const inProgressJobs = jobs.filter(job => job.status === 'in-progress').length;
  const completedJobs = jobs.filter(job => job.status === 'completed').length;

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortConfig.field !== field) return <ChevronDown className="w-4 h-4 text-gray-400" />;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-primary" /> : 
      <ChevronDown className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Jobs</h1>
        <button 
          className="btn-primary"
          onClick={() => setIsNewJobModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2 inline-block" /> Create Job
        </button>
      </div>

      {selectedJob ? (
        <div className="animate-slide-down">
          <JobDetails 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)}
            statuses={jobStatuses}
            isEditModalOpen={isEditModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
          />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 animate-fade-in">
          <div className="bg-surface rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold mt-2">{pendingJobs}</p>
          </div>
          <div className="bg-surface rounded-xl p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium">In Progress</span>
            </div>
            <p className="text-2xl font-bold mt-2">{inProgressJobs}</p>
          </div>
          <div className="bg-surface rounded-xl p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold mt-2">{completedJobs}</p>
          </div>
          <div className="bg-surface rounded-xl p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="font-medium">Overdue</span>
            </div>
            <p className="text-2xl font-bold mt-2">1</p>
          </div>
        </div>
      )}

      <div className="bg-surface rounded-xl shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="input-primary pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <button 
              className="px-4 py-2 text-text bg-background rounded-lg hover:bg-gray-200 flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5" />
              Filter
            </button>
            
            {showFilters && (
              <div className="absolute right-0 top-12 w-72 bg-white rounded-lg shadow-lg p-4 z-10 animate-slide-down">
                <h3 className="font-medium mb-3">Filter Jobs</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <div className="space-y-2">
                      {Object.keys(statusColors).map((status) => (
                        <label key={status} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={statusFilter.includes(status)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setStatusFilter([...statusFilter, status]);
                              } else {
                                setStatusFilter(statusFilter.filter(s => s !== status));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="capitalize">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Price Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="input-primary w-1/2"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className="input-primary w-1/2"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th 
                  className="text-left py-3 px-4 text-text cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-1">
                    Job
                    <SortIcon field="title" />
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 text-text cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('customer')}
                >
                  <div className="flex items-center gap-1">
                    Customer
                    <SortIcon field="customer" />
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 text-text cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    <SortIcon field="status" />
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 text-text cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('scheduledDate')}
                >
                  <div className="flex items-center gap-1">
                    Date
                    <SortIcon field="scheduledDate" />
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 text-text cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-1">
                    Price
                    <SortIcon field="price" />
                  </div>
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Last activity</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedJobs.map((job) => {
                const customer = customers.find(c => c.id === job.customerId);
                return (
                  <tr
                    key={job.id}
                    onClick={() => handleJobClick(job)}
                    className="border-b border-gray-200 hover:bg-background cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-text">{job.title}</div>
                    </td>
                    <td className="py-3 px-4 text-text">{customer?.name}</td>
                    <td className="py-3 px-4">
                      <StatusIndicator status={job.status} />
                    </td>
                    <td className="py-3 px-4 text-text">{job.scheduledDate}</td>
                    <td className="py-3 px-4 text-text">${job.price.toLocaleString()}</td>
                    <td className="py-3 px-4 text-text text-right">
                      {new Date(job.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJob(job);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <NewJobModal
        isOpen={isNewJobModalOpen}
        onClose={() => setIsNewJobModalOpen(false)}
      />
    </div>
  );
}