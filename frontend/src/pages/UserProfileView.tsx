import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../components/DashboardLayout'
import { FollowButton } from '../components/FollowButton'
import { followService } from '../services/followService'
import { useAuthStore } from '../store/authStore'
import { MessageCircle, Users, MapPin, Link2, Instagram, Youtube } from 'lucide-react'
import './UserProfileView.css'

interface SuggestedUser {
  _id: string
  name?: string
  email?: string
  profilePicture?: string
  userType?: string
  followersCount?: number
  isFollowing?: boolean
}

export const UserProfileView = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuthStore()
  const [profileUser, setProfileUser] = useState<any>(null)
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [suggestionsLoading, setSuggestionsLoading] = useState(true)

  useEffect(() => {
    loadProfile()
    loadSuggestedUsers()
  }, [userId])

  const loadProfile = async () => {
    if (!userId) return
    
    try {
      const user = await followService.getUserProfile(userId)
      setProfileUser(user)
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSuggestedUsers = async () => {
    try {
      setSuggestionsLoading(true)
      const suggestions = await followService.getSuggestions(5)
      setSuggestedUsers(suggestions || [])
    } catch (error) {
      console.error('Failed to load suggested users:', error)
    } finally {
      setSuggestionsLoading(false)
    }
  }

  const handleMessageUser = () => {
    navigate(`/messaging?userId=${userId}`)
  }

  const handleFollowSuggestion = async (suggestedUserId: string, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        await followService.unfollowUser(suggestedUserId)
      } else {
        await followService.followUser(suggestedUserId)
      }
      // Update the suggested user's follow status
      setSuggestedUsers(prev => 
        prev.map(u => 
          u._id === suggestedUserId 
            ? { ...u, isFollowing: !isFollowing, followersCount: isFollowing ? (u.followersCount || 0) - 1 : (u.followersCount || 0) + 1 }
            : u
        )
      )
    } catch (error) {
      console.error('Failed to follow/unfollow:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <DashboardLayout
      title={profileUser?.name || 'Profile'}
      subtitle={profileUser?.userType}
      sidebarItems={[
        { label: 'Back to Discover', href: '/discover' },
      ]}
    >
      <div className="profile-view-container">
        <div className="profile-content-wrapper">
          {/* Main Profile Section */}
          <div className="profile-main-section">
            <div className="profile-header-card">
              <div className="profile-header-content">
                <div className="profile-avatar-large">
                  {profileUser?.profilePicture ? (
                    <img 
                      src={profileUser.profilePicture} 
                      alt={profileUser.name}
                    />
                  ) : (
                    <div className="avatar-placeholder-large">
                      {getInitials(profileUser?.name || 'User')}
                    </div>
                  )}
                </div>

                <div className="profile-header-info">
                  <h1>{profileUser?.name}</h1>
                  <p className="profile-email">{profileUser?.email}</p>
                  
                  {profileUser?.userType && (
                    <span className={`user-type-badge ${profileUser.userType}`}>
                      {profileUser.userType === 'influencer' ? '⭐ Influencer' : '🏢 Brand'}
                    </span>
                  )}

                  {profileUser?.bio && (
                    <p className="profile-bio">{profileUser.bio}</p>
                  )}

                  {profileUser?.location && (
                    <p className="profile-location">
                      <MapPin size={16} /> {profileUser.location}
                    </p>
                  )}

                  <div className="profile-stats">
                    <button
                      className="stat-button"
                      onClick={() => navigate(`/profile/${userId}/connections?tab=followers`)}
                    >
                      <strong>{profileUser?.followersCount || 0}</strong> followers
                    </button>
                    <button
                      className="stat-button"
                      onClick={() => navigate(`/profile/${userId}/connections?tab=following`)}
                    >
                      <strong>{profileUser?.followingCount || 0}</strong> following
                    </button>
                  </div>

                  {currentUser?._id !== userId && (
                    <div className="profile-actions">
                      <FollowButton 
                        userId={userId!} 
                        size="large"
                        onFollowChange={loadProfile}
                      />
                      <button
                        onClick={handleMessageUser}
                        className="message-btn"
                      >
                        <MessageCircle size={18} />
                        Message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            {(profileUser?.instagramHandle || profileUser?.youtubeChannel || profileUser?.website) && (
              <div className="profile-section">
                <h2>Social Media</h2>
                <div className="social-links">
                  {profileUser?.instagramHandle && (
                    <a 
                      href={`https://instagram.com/${profileUser.instagramHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link instagram"
                    >
                      <Instagram size={18} />
                      @{profileUser.instagramHandle}
                    </a>
                  )}
                  {profileUser?.youtubeChannel && (
                    <a 
                      href={profileUser.youtubeChannel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link youtube"
                    >
                      <Youtube size={18} />
                      YouTube
                    </a>
                  )}
                  {profileUser?.website && (
                    <a 
                      href={profileUser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      style={{ background: '#6c757d', color: 'white' }}
                    >
                      <Link2 size={18} />
                      Website
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Suggested Users Sidebar */}
          <div className="suggestions-sidebar">
            <div className="suggestions-header">
              <Users size={20} />
              <h3>Suggested for you</h3>
            </div>

            {suggestionsLoading ? (
              <div className="suggestions-loading">Loading...</div>
            ) : suggestedUsers.length === 0 ? (
              <div className="suggestions-empty">No suggestions available</div>
            ) : (
              <div className="suggestions-list">
                {suggestedUsers.map((user) => (
                  <div key={user._id} className="suggestion-item">
                    <div 
                      className="suggestion-avatar"
                      onClick={() => navigate(`/profile/${user._id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {getInitials(user.name || 'User')}
                        </div>
                      )}
                    </div>

                    <div className="suggestion-info">
                      <h4 
                        onClick={() => navigate(`/profile/${user._id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        {user.name}
                      </h4>
                      <p className="suggestion-type">{user.userType || 'User'}</p>
                      <p className="suggestion-followers">
                        {user.followersCount || 0} followers
                      </p>
                    </div>

                    <button
                      className={`suggestion-follow-btn ${user.isFollowing ? 'following' : ''}`}
                      onClick={() => handleFollowSuggestion(user._id, user.isFollowing || false)}
                    >
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button 
              className="see-all-btn"
              onClick={() => navigate('/discover')}
            >
              Discover More Users
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}