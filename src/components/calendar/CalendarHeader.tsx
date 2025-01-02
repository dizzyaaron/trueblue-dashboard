import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onNewAppointment: () => void;
}

export default function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onNewAppointment
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-text dark:text-dark-text">
        {format(currentDate, 'MMMM yyyy')}
      </h2>
      <div className="flex gap-4">
        <div className="flex gap-2">
          <button
            onClick={onPrevMonth}
            className="p-2 hover:bg-background dark:hover:bg-gray-700 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 dark:text-dark-text" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-background dark:hover:bg-gray-700 rounded-lg"
          >
            <ChevronRight className="w-5 h-5 dark:text-dark-text" />
          </button>
        </div>
        <button onClick={onNewAppointment} className="btn-primary">
          <Plus className="w-5 h-5 mr-2 inline-block" />
          New Appointment
        </button>
      </div>
    </div>
  );
}