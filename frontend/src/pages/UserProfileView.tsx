import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../components/DashboardLayout'
import { FollowButton } from '../components/FollowButton'
import { followService } from '../services/followService'
import { useAuthStore } from '../store/authStore'

export const UserProfileView = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuthStore()
  const [profileUser, setProfileUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
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
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              overflow: 'hidden',
              flexShrink: 0
            }}>
              {profileUser?.profilePicture ? (
                <img 
                  src={profileUser.profilePicture} 
                  alt={profileUser.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '48px',
                  fontWeight: 600
                }}>
                  {getInitials(profileUser?.name || 'User')}
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '32px', margin: '0 0 8px 0' }}>
                {profileUser?.name}
              </h1>
              <p style={{ color: '#666', marginBottom: '16px' }}>
                {profileUser?.email}
              </p>
              
              {profileUser?.bio && (
                <p style={{ color: '#333', marginBottom: '16px', lineHeight: 1.6 }}>
                  {profileUser.bio}
                </p>
              )}

              <div style={{ 
                display: 'flex', 
                gap: '24px', 
                marginBottom: '16px',
                fontSize: '15px'
              }}>
                <button
                  onClick={() => navigate(`/profile/${userId}/connections?tab=followers`)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#333',
                    fontWeight: 600
                  }}
                >
                  <strong>{profileUser?.followersCount || 0}</strong> followers
                </button>
                <button
                  onClick={() => navigate(`/profile/${userId}/connections?tab=following`)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#333',
                    fontWeight: 600
                  }}
                >
                  <strong>{profileUser?.followingCount || 0}</strong> following
                </button>
              </div>

              {currentUser?._id !== userId && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <FollowButton 
                    userId={userId!} 
                    size="large"
                    onFollowChange={loadProfile}
                  />
                  <button
                    onClick={() => navigate('/messaging')}
                    style={{
                      padding: '12px 32px',
                      background: '#e0e0e0',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}