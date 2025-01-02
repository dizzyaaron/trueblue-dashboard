import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LogoState {
  logo: string | null;
  collapsedLogo: string | null;
  showText: boolean;
  setLogo: (logo: string | null) => void;
  setCollapsedLogo: (logo: string | null) => void;
  setShowText: (show: boolean) => void;
}

export const useLogoStore = create<LogoState>()(
  persist(
    (set) => ({
      logo: null,
      collapsedLogo: null,
      showText: true,
      setLogo: (logo) => set({ logo }),
      setCollapsedLogo: (logo) => set({ collapsedLogo: logo }),
      setShowText: (show) => set({ showText: show }),
    }),
    {
      name: 'logo-storage',
    }
  )
);