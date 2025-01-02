import React from 'react';
import DetailSection from './DetailSection';
import DetailField from './DetailField';
import NotesSection from './NotesSection';
import { Job } from '../../types';

interface JobDetailsProps {
  job: Job;
  onUpdate: (id: string, data: Partial<Job>) => void;
  onAddNote: (note: string) => void;
}

export default function JobDetails({ 
  job, 
  onUpdate,
  onAddNote 
}: JobDetailsProps) {
  const notes = job.notes ? JSON.parse(job.notes) : [];

  const handleSaveDetails = (data: Partial<Job>) => {
    onUpdate(job.id, data);
  };

  const handleSaveScheduling = (data: Partial<Job>) => {
    onUpdate(job.id, data);
  };

  return (
    <div className="space-y-6">
      <DetailSection title="Job Details" onSave={handleSaveDetails}>
        <DetailField label="Title" value={job.title} />
        <DetailField label="Description" value={job.description} />
        <DetailField label="Status" value={job.status} />
        <DetailField label="Price" value={job.price} type="number" />
      </DetailSection>

      <DetailSection title="Scheduling" onSave={handleSaveScheduling}>
        <DetailField label="Scheduled Date" value={job.scheduledDate} type="date" />
        <DetailField label="Location" value={job.location} />
      </DetailSection>

      <NotesSection 
        notes={notes} 
        onAddNote={onAddNote}
      />
    </div>
  );
}