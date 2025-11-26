// Save as: frontend/src/pages/FollowersFollowingPage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { FollowButton } from '../components/FollowButton';
import { followService } from '../services/followService';
import { useAuthStore } from '../store/authStore';
import './FollowersFollowingPage.css';

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  userType: string;
  bio?: string;
  followersCount: number;
}

export const FollowersFollowingPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'followers';
  const { user: currentUser } = useAuthStore();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [profileUser, setProfileUser] = useState<any>(null);

  const getSidebarItems = () => {
    if (currentUser?.userType === 'influencer') {
      return [
        { label: 'Dashboard', href: '/influencer/dashboard' },
        { label: 'My Profile', href: '/influencer/profile' },
        { label: 'Discover', href: '/discover' },
      ];
    } else {
      return [
        { label: 'Dashboard', href: '/brand/dashboard' },
        { label: 'Browse Influencers', href: '/brand/browse-influencers' },
        { label: 'Discover', href: '/discover' },
      ];
    }
  };

  useEffect(() => {
    loadData();
  }, [userId, tab, page]);

  const loadData = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Load profile user info
      const userProfile = await followService.getUserProfile(userId);
      setProfileUser(userProfile);

      // Load followers or following
      const result = tab === 'followers' 
        ? await followService.getFollowers(userId, page, 20)
        : await followService.getFollowing(userId, page, 20);
      
      setUsers(tab === 'followers' ? result.followers : result.following);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const switchTab = (newTab: string) => {
    navigate(`/profile/${userId}/connections?tab=${newTab}`);
    setPage(1);
  };

  return (
    <DashboardLayout
      title={profileUser ? `${profileUser.name}'s Connections` : 'Connections'}
      subtitle={tab === 'followers' ? 'People following this user' : 'People this user follows'}
      sidebarItems={getSidebarItems()}
    >
      <div className="connections-container">
        {/* Tabs */}
        <div className="connections-tabs">
          <button
            className={`tab ${tab === 'followers' ? 'active' : ''}`}
            onClick={() => switchTab('followers')}
          >
            Followers
            {profileUser && <span className="count">{profileUser.followersCount}</span>}
          </button>
          <button
            className={`tab ${tab === 'following' ? 'active' : ''}`}
            onClick={() => switchTab('following')}
          >
            Following
            {profileUser && <span className="count">{profileUser.followingCount}</span>}
          </button>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="loading">Loading...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>
              {tab === 'followers' 
                ? 'No followers yet' 
                : 'Not following anyone yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="connections-list">
              {users.map((user) => (
                <div key={user._id} className="connection-card">
                  <div 
                    className="connection-avatar"
                    onClick={() => handleUserClick(user._id)}
                  >
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {getInitials(user.name)}
                      </div>
                    )}
                  </div>
                  
                  <div className="connection-info">
                    <h4 onClick={() => handleUserClick(user._id)}>{user.name}</h4>
                    <p className="connection-email">{user.email}</p>
                    <span className="user-type-badge">{user.userType}</span>
                    {user.bio && <p className="connection-bio">{user.bio}</p>}
                    <p className="followers-count">{user.followersCount} followers</p>
                  </div>
                  
                  <div className="connection-actions">
                    <FollowButton 
                      userId={user._id}
                      size="medium"
                      onFollowChange={loadData}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};