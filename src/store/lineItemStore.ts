import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedLineItem {
  id: string;
  name: string;
  description: string;
  defaultQuantity: number;
  defaultPrice: number;
  createdAt: string;
  updatedAt: string;
}

interface LineItemState {
  savedItems: SavedLineItem[];
  addItem: (item: Omit<SavedLineItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<SavedLineItem>) => void;
  deleteItem: (id: string) => void;
}

export const useLineItemStore = create<LineItemState>()(
  persist(
    (set) => ({
      savedItems: [],
      addItem: (item) => set((state) => ({
        savedItems: [...state.savedItems, {
          ...item,
          id: `li_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }]
      })),
      updateItem: (id, updatedItem) => set((state) => ({
        savedItems: state.savedItems.map(item =>
          item.id === id 
            ? { ...item, ...updatedItem, updatedAt: new Date().toISOString() }
            : item
        )
      })),
      deleteItem: (id) => set((state) => ({
        savedItems: state.savedItems.filter(item => item.id !== id)
      }))
    }),
    {
      name: 'line-items-storage'
    }
  )
);