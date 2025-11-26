import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  _id: string
  name: string
  email: string
  userType: 'influencer' | 'brand' | 'admin'
  profilePicture?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  // Initialize from existing localStorage on mount
  initialize: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        localStorage.setItem('userType', user.userType)
        set({ 
          user: { ...user, _id: user.id || user._id },
          token, 
          isAuthenticated: true 
        })
      },
      
      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userType')
        set({ user: null, token: null, isAuthenticated: false })
      },
      
      updateUser: (userData) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        })),
      
      initialize: () => {
        const token = localStorage.getItem('token')
        const userType = localStorage.getItem('userType')
        if (token && userType) {
          // Fetch user data from /api/auth/me endpoint
          fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then(res => res.json())
          .then(userData => {
            set({
              user: { ...userData, _id: userData._id || userData.id },
              token,
              isAuthenticated: true
            })
          })
          .catch(() => {
            // If token is invalid, clear everything
            get().logout()
          })
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
)