import { create } from 'zustand'

type UserType = 'influencer' | 'brand' | 'admin' | null

interface AppState {
  userType: UserType
  setUserType: (type: UserType) => void
  unreadMessages: number
  setUnreadMessages: (count: number) => void
  theme: 'light'
}

export const useAppStore = create<AppState>((set) => ({
  userType: null,
  setUserType: (type) => set({ userType: type }),
  unreadMessages: 3,
  setUnreadMessages: (count) => set({ unreadMessages: count }),
  theme: 'light',
}))

