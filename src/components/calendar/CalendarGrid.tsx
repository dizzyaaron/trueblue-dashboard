import React from 'react';
import { format, isToday, isSameMonth } from 'date-fns';
import CalendarEvent from './CalendarEvent';
import { Job } from '../../types';

interface CalendarGridProps {
  days: Date[];
  firstDayOfMonth: Date;
  currentDate: Date;
  getJobsForDate: (date: Date) => Job[];
  onJobClick: (job: Job) => void;
}

export default function CalendarGrid({
  days,
  firstDayOfMonth,
  currentDate,
  getJobsForDate,
  onJobClick
}: CalendarGridProps) {
  return (
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
        <div key={`empty-start-${index}`} className="bg-surface dark:bg-dark-surface p-4" />
      ))}
      
      {days.map((day, index) => {
        const dayJobs = getJobsForDate(day);
        return (
          <div
            key={`day-${format(day, 'yyyy-MM-dd')}`}
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
            
            <div className="mt-2 space-y-1">
              {dayJobs.map(job => (
                <CalendarEvent 
                  key={`event-${job.id}`}
                  job={job} 
                  onClick={onJobClick}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}