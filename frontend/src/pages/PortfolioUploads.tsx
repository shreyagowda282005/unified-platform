// Save as: frontend/src/pages/PortfolioUploads.tsx
// Enhanced version with follow suggestions sidebar

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { FollowButton } from '../components/FollowButton';
import { followService } from '../services/followService';
import './PortfolioUploads.css';

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  userType: string;
  followersCount: number;
}

export const PortfolioUploads = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Your existing portfolio state here
  // const [portfolioItems, setPortfolioItems] = useState([]);

  useEffect(() => {
    loadSuggestions();
    // loadPortfolioItems(); // Your existing function
  }, []);

  const loadSuggestions = async () => {
    try {
      const data = await followService.getSuggestions(5);
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
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

  const sidebarItems = [
    { label: 'Dashboard', href: '/influencer/dashboard' },
    { label: 'My Profile', href: '/influencer/profile' },
    { label: 'Portfolio Uploads', href: '/influencer/portfolio' },
    { label: 'Discover', href: '/discover' },
    { label: 'My Applications', href: '/influencer/campaigns' },
    { label: 'Messaging', href: '/influencer/messaging' },
    { label: 'Earnings', href: '/influencer/earnings' },
  ];

  return (
    <DashboardLayout
      title="Portfolio Uploads"
      subtitle="Manage your portfolio content"
      sidebarItems={sidebarItems}
    >
      <div className="portfolio-container">
        {/* Main Content Area */}
        <div className="portfolio-main">
          <h2>Your Portfolio</h2>
          
          {/* YOUR EXISTING PORTFOLIO UPLOAD CODE HERE */}
          <div className="portfolio-grid">
            {/* Your portfolio items */}
          </div>
        </div>

        {/* Suggestions Sidebar */}
        <div className="suggestions-sidebar">
          <div className="suggestions-card">
            <div className="suggestions-header">
              <h3>Suggested for you</h3>
              <button 
                onClick={() => navigate('/discover')}
                className="see-all-btn"
              >
                See All
              </button>
            </div>

            {loading ? (
              <div className="suggestions-loading">Loading...</div>
            ) : suggestions.length === 0 ? (
              <div className="suggestions-empty">
                <p>No suggestions available</p>
              </div>
            ) : (
              <div className="suggestions-list">
                {suggestions.map((user) => (
                  <div key={user._id} className="suggestion-item">
                    <div 
                      className="suggestion-avatar"
                      onClick={() => handleUserClick(user._id)}
                    >
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.name} />
                      ) : (
                        <div className="avatar-placeholder-small">
                          {getInitials(user.name)}
                        </div>
                      )}
                    </div>
                    
                    <div className="suggestion-info">
                      <h4 onClick={() => handleUserClick(user._id)}>
                        {user.name}
                      </h4>
                      <p className="suggestion-meta">
                        {user.userType} • {user.followersCount} followers
                      </p>
                    </div>
                    
                    <FollowButton 
                      userId={user._id}
                      size="small"
                      onFollowChange={loadSuggestions}
                    />
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={() => navigate('/discover')}
              className="discover-more-btn"
            >
              Discover More Users
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};