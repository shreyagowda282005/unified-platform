// followService.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export const followService = {
  // Get suggested users
  async getSuggestions(limit: number = 5) {
    try {
      const response = await fetch(`${API_URL}/users/suggestions?limit=${limit}`, {
        headers: getAuthHeaders()
      })
      
      if (!response.ok) {
        throw new Error('Failed to get suggestions')
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      // Return empty array instead of throwing to prevent crashes
      return []
    }
  },

  // Search users
  async searchUsers(query: string = '', userType?: string, page: number = 1, limit: number = 20) {
    try {
      let url = `${API_URL}/users/search?page=${page}&limit=${limit}`
      if (query) url += `&query=${encodeURIComponent(query)}`
      if (userType && userType !== 'all') url += `&userType=${userType}`

      const response = await fetch(url, {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to search users')
      }

      return await response.json()
    } catch (error) {
      console.error('Error searching users:', error)
      throw error
    }
  },

  // Get user profile
  async getUserProfile(userId: string) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to get user profile')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }
  },

  // Follow user
  async followUser(userId: string) {
    try {
      const response = await fetch(`${API_URL}/users/follow/${userId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to follow user')
      }

      return await response.json()
    } catch (error) {
      console.error('Error following user:', error)
      throw error
    }
  },

  // Unfollow user
  async unfollowUser(userId: string) {
    try {
      const response = await fetch(`${API_URL}/users/unfollow/${userId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to unfollow user')
      }

      return await response.json()
    } catch (error) {
      console.error('Error unfollowing user:', error)
      throw error
    }
  },

  // Get followers
  async getFollowers(userId: string) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/followers`, {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to get followers')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching followers:', error)
      throw error
    }
  },

  // Get following
  async getFollowing(userId: string) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/following`, {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to get following')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching following:', error)
      throw error
    }
  }
}