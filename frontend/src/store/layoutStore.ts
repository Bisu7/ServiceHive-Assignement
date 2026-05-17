import { create } from 'zustand'

interface LayoutState {
  isCollapsed: boolean
  isMobileOpen: boolean
  toggleCollapsed: () => void
  setCollapsed: (val: boolean) => void
  toggleMobileOpen: () => void
  setMobileOpen: (val: boolean) => void
}

export const useLayoutStore = create<LayoutState>((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (val) => set({ isCollapsed: val }),
  toggleMobileOpen: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  setMobileOpen: (val) => set({ isMobileOpen: val }),
}))

export default useLayoutStore
