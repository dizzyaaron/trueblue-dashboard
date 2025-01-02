import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { validateApiKey } from '../utils/openai/config';

interface AISettingsState {
  apiKey: string;
  setApiKey: (key: string) => string | null; // Returns error message if invalid
  clearApiKey: () => void;
  isOfflineMode: boolean;
  setOfflineMode: (offline: boolean) => void;
}

export const useAISettingsStore = create<AISettingsState>()(
  persist(
    (set) => ({
      apiKey: '',
      isOfflineMode: false,
      setApiKey: (key) => {
        const error = validateApiKey(key);
        if (!error) {
          set({ apiKey: key, isOfflineMode: false });
        }
        return error;
      },
      clearApiKey: () => set({ apiKey: '', isOfflineMode: true }),
      setOfflineMode: (offline) => set({ isOfflineMode: offline })
    }),
    {
      name: 'ai-settings-storage',
    }
  )
);