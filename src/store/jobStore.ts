import { create } from 'zustand';
import { Job } from '../types';

interface JobState {
  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [
    {
      id: '1',
      customerId: '1',
      title: 'Bathroom Renovation',
      description: 'Full bathroom remodel including new fixtures',
      status: 'in-progress',
      scheduledDate: '2024-03-15',
      location: '123 Main St, Anytown, USA',
      price: 2500,
      createdAt: '2024-03-01',
      updatedAt: '2024-03-01'
    }
  ],
  addJob: (job) => set((state) => ({ 
    jobs: [...state.jobs, job] 
  })),
  updateJob: (id, updatedJob) => set((state) => ({
    jobs: state.jobs.map((job) => 
      job.id === id ? { ...job, ...updatedJob, updatedAt: new Date().toISOString() } : job
    )
  })),
  deleteJob: (id) => set((state) => ({
    jobs: state.jobs.filter((job) => job.id !== id)
  }))
}));