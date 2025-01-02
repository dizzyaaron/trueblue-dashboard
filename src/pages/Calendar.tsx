import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useJobStore } from '../store/jobStore';
import CalendarEvent from '../components/calendar/CalendarEvent';
import JobDetails from '../components/JobDetails';
import NewAppointmentModal from '../components/calendar/NewAppointmentModal';
import { Job } from '../types';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const { jobs } = useJobStore();
  
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  const getJobsForDate = (date: Date) => {
    return jobs.filter(job => {
      const jobDate = parseISO(job.scheduledDate);
      return format(jobDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text dark:text-dark-text">Calendar</h1>
        <button 
          className="btn-primary"
          onClick={() => setIsNewAppointmentModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2 inline-block" />
          New Appointment
        </button>
      </div>

      {selectedJob && (
        <div className="animate-slide-down">
          <JobDetails 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)}
            statuses={[
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
            ]}
            isEditModalOpen={isEditModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
          />
        </div>
      )}

      <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text dark:text-dark-text">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
              className="p-2 hover:bg-background dark:hover:bg-gray-700 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 dark:text-dark-text" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
              className="p-2 hover:bg-background dark:hover:bg-gray-700 rounded-lg"
            >
              <ChevronRight className="w-5 h-5 dark:text-dark-text" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="bg-surface dark:bg-dark-surface p-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
          
          {Array.from({ length: firstDayOfMonth.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="bg-surface dark:bg-dark-surface p-4" />
          ))}
          
          {days.map((day) => {
            const dayJobs = getJobsForDate(day);
            return (
              <div
                key={day.toISOString()}
                className={`bg-surface dark:bg-dark-surface p-4 min-h-[120px] ${
                  isToday(day) ? 'bg-primary/5 dark:bg-primary/20' : ''
                } ${!isSameMonth(day, currentDate) ? 'text-gray-400' : ''}`}
              >
                <span className={`text-sm font-medium ${
                  isToday(day) ? 'bg-primary text-white px-2 py-1 rounded-full' : 
                  'dark:text-dark-text'
                }`}>
                  {format(day, 'd')}
                </span>
                
                <div className="mt-2 space-y-1 max-h-[80px] overflow-y-auto scrollbar-hide">
                  {dayJobs.map(job => (
                    <CalendarEvent 
                      key={job.id} 
                      job={job} 
                      onClick={() => setSelectedJob(job)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NewAppointmentModal
        isOpen={isNewAppointmentModalOpen}
        onClose={() => setIsNewAppointmentModalOpen(false)}
      />
    </div>
  );
}