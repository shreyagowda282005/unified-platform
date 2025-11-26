// Save as: frontend/src/services/followService.ts

const API_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with auth token
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const followService = {
  // Follow a user
  followUser: async (userId: string) => {
    const response = await fetch(`${API_URL}/users/${userId}/follow`, {
      method: 'POST',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to follow user');
    }
    
    return response.json();
  },

  // Unfollow a user
  unfollowUser: async (userId: string) => {
    const response = await fetch(`${API_URL}/users/${userId}/unfollow`, {
      method: 'POST',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to unfollow user');
    }
    
    return response.json();
  },

  // Check if following a user
  checkFollowStatus: async (userId: string) => {
    const response = await fetch(`${API_URL}/users/${userId}/follow-status`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to check follow status');
    }
    
    return response.json();
  },

  // Get followers list
  getFollowers: async (userId: string, page = 1, limit = 20) => {
    const response = await fetch(
      `${API_URL}/users/${userId}/followers?page=${page}&limit=${limit}`,
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get followers');
    }
    
    return response.json();
  },

  // Get following list
  getFollowing: async (userId: string, page = 1, limit = 20) => {
    const response = await fetch(
      `${API_URL}/users/${userId}/following?page=${page}&limit=${limit}`,
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get following');
    }
    
    return response.json();
  },

  // Get follow suggestions
  getSuggestions: async (limit = 10) => {
    const response = await fetch(
      `${API_URL}/users/suggestions?limit=${limit}`,
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get suggestions');
    }
    
    return response.json();
  },

  // Search users
  searchUsers: async (query: string, userType?: string, page = 1, limit = 20) => {
    let url = `${API_URL}/users/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    
    if (userType && userType !== 'all') {
      url += `&userType=${userType}`;
    }
    
    const response = await fetch(url, { headers: getHeaders() });
    
    if (!response.ok) {
      throw new Error('Failed to search users');
    }
    
    return response.json();
  },

  // Get user profile (for viewing other users)
  getUserProfile: async (userId: string) => {
    const response = await fetch(`${API_URL}/users/${userId}/profile`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }
    
    return response.json();
  },
};