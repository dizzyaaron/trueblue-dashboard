import React, { useState, useEffect } from 'react';
import { Briefcase, DollarSign, Users, FileText, Plus } from 'lucide-react';
import BackgroundDateTime from '../components/dashboard/BackgroundDateTime';
import StatsCard from '../components/StatsCard';
import UpcomingJobs from '../components/dashboard/UpcomingJobs';
import ActiveRequests from '../components/dashboard/ActiveRequests';
import Achievements from '../components/dashboard/Achievements';
import AIAssistants from '../components/dashboard/AIAssistants';
import ClientAttention from '../components/dashboard/ClientAttention';
import NewClientModal from '../components/modals/NewClientModal';
import NewRequestModal from '../components/modals/NewRequestModal';
import NewQuoteModal from '../components/modals/NewQuoteModal';
import SearchBar from '../components/SearchBar';
import { useJobStore } from '../store/jobStore';
import { useCustomerStore } from '../store/customerStore';

export default function Dashboard() {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [activeModal, setActiveModal] = useState<'client' | 'request' | 'quote' | null>(null);
  const { jobs } = useJobStore();
  const { customers } = useCustomerStore();
  const [isInitialRender, setIsInitialRender] = useState(true);

  const handleCreateClick = (type: 'client' | 'request' | 'quote') => {
    setActiveModal(type);
    setShowCreateMenu(false);
  };

  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  // Calculate statistics
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(job => job.status === 'completed').length;
  const monthlyEarnings = jobs
    .filter(job => {
      const jobDate = new Date(job.createdAt);
      const now = new Date();
      return jobDate.getMonth() === now.getMonth() && 
             jobDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, job) => sum + job.price, 0);

  return (
    <div className="space-y-6 relative">
      <BackgroundDateTime />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text dark:text-dark-text">Dashboard</h1>
        <div className="flex items-center gap-4">
          <SearchBar />
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New
            </button>
            
            {showCreateMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 animate-fade-in">
                <button
                  onClick={() => handleCreateClick('client')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                >
                  New Client
                </button>
                <button
                  onClick={() => handleCreateClick('request')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                >
                  New Request
                </button>
                <button
                  onClick={() => handleCreateClick('quote')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                >
                  New Quote
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AIAssistants />

      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          title="Total Jobs"
          value={totalJobs}
          icon={Briefcase}
          trend={{ value: 12, isPositive: true }}
          animate={!isInitialRender && jobs.length > 0}
        />
        <StatsCard
          title="Monthly Earnings"
          value={`$${monthlyEarnings}`}
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
          animate={!isInitialRender && monthlyEarnings > 0}
        />
        <StatsCard
          title="Active Customers"
          value={customers.length}
          icon={Users}
          trend={{ value: 5, isPositive: true }}
          animate={!isInitialRender && customers.length > 0}
        />
        <StatsCard
          title="Completion Rate"
          value={totalJobs ? Math.round((completedJobs / totalJobs) * 100) : 0}
          icon={FileText}
          trend={{ value: 3, isPositive: true }}
          animate={!isInitialRender && completedJobs > 0}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <UpcomingJobs />
          <ActiveRequests />
          <ClientAttention />
        </div>
        <div className="space-y-6">
          <div className="scale-90 origin-top">
            <Achievements />
          </div>
        </div>
      </div>
      
      <NewClientModal
        isOpen={activeModal === 'client'}
        onClose={() => setActiveModal(null)}
      />
      <NewRequestModal
        isOpen={activeModal === 'request'}
        onClose={() => setActiveModal(null)}
      />
      <NewQuoteModal
        isOpen={activeModal === 'quote'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}