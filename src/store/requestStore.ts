import { create } from 'zustand';
import { Request } from '../types';

interface RequestState {
  requests: Request[];
  addRequest: (request: Request) => void;
  updateRequest: (id: string, request: Partial<Request>) => void;
  deleteRequest: (id: string) => void;
}

export const useRequestStore = create<RequestState>((set) => ({
  requests: [],
  addRequest: (request) => set((state) => ({ 
    requests: [...state.requests, request] 
  })),
  updateRequest: (id, updatedRequest) => set((state) => ({
    requests: state.requests.map((request) => 
      request.id === id ? { ...request, ...updatedRequest } : request
    )
  })),
  deleteRequest: (id) => set((state) => ({
    requests: state.requests.filter((request) => request.id !== id)
  }))
}));