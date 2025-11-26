// Save as: frontend/src/components/FollowButton.tsx

import { useState, useEffect } from 'react';
import { followService } from '../services/followService';
import { useAuthStore } from '../store/authStore';
import './FollowButton.css';

interface FollowButtonProps {
  userId: string;
  size?: 'small' | 'medium' | 'large';
  onFollowChange?: () => void;
}

export const FollowButton = ({ userId, size = 'medium', onFollowChange }: FollowButtonProps) => {
  const { user: currentUser } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    checkFollowStatus();
  }, [userId]);

  const checkFollowStatus = async () => {
    try {
      const response = await followService.checkFollowStatus(userId);
      setIsFollowing(response.isFollowing);
    } catch (error) {
      console.error('Failed to check follow status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleFollowToggle = async () => {
    if (loading) return;

    setLoading(true);
    try {
      if (isFollowing) {
        await followService.unfollowUser(userId);
        setIsFollowing(false);
      } else {
        await followService.followUser(userId);
        setIsFollowing(true);
      }
      
      // Call the callback to refresh parent data if provided
      if (onFollowChange) {
        onFollowChange();
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show button for own profile
  if (currentUser?._id === userId) {
    return null;
  }

  if (checkingStatus) {
    return (
      <button className={`follow-btn follow-btn-${size} follow-btn-loading`} disabled>
        ...
      </button>
    );
  }

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`follow-btn follow-btn-${size} ${
        isFollowing ? 'follow-btn-following' : 'follow-btn-follow'
      } ${loading ? 'follow-btn-loading' : ''}`}
    >
      {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};