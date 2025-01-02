import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Quote {
  id: string;
  customerId: string;
  title: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  lineItems: Array<{
    id: string;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  tax: number;
  taxEnabled: boolean;
  discount: number;
  total: number;
  requiredDeposit: number;
  clientMessage: string;
  disclaimer: string;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

interface QuoteState {
  quotes: Quote[];
  addQuote: (quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateQuote: (id: string, quote: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set) => ({
      quotes: [],
      addQuote: (quote) => {
        const id = `q${Date.now()}`;
        const newQuote = {
          ...quote,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          quotes: [...state.quotes, newQuote]
        }));
        return id;
      },
      updateQuote: (id, updatedQuote) => set((state) => ({
        quotes: state.quotes.map((quote) =>
          quote.id === id ? { 
            ...quote, 
            ...updatedQuote, 
            updatedAt: new Date().toISOString() 
          } : quote
        )
      })),
      deleteQuote: (id) => set((state) => ({
        quotes: state.quotes.filter((quote) => quote.id !== id)
      }))
    }),
    {
      name: 'quotes-storage'
    }
  )
);