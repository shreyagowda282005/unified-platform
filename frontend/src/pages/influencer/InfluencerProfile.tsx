import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { socialService } from '../../services/socialService'

const sidebarItems = [
  { label: 'Dashboard', href: '/influencer/dashboard' },
  { label: 'My Profile', href: '/influencer/profile' },
  { label: 'Portfolio Uploads', href: '/influencer/portfolio' },
  { label: 'My Applications', href: '/influencer/campaigns' },
  { label: 'Discover', href: '/discover' },
  { label: 'Messaging', href: '/influencer/messaging' },
  { label: 'Earnings', href: '/influencer/earnings' },
  { label: 'Settings', href: '/settings' },
]

type SocialStatus = {
  instagram: { connected: boolean; username?: string }
  youtube: { connected: boolean; channelName?: string }
}

export const InfluencerProfile = () => {
  const [socialStatus, setSocialStatus] = useState<SocialStatus>({
    instagram: { connected: false },
    youtube: { connected: false },
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSocialStatus()
    // Check for success/error messages from OAuth redirect
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const error = urlParams.get('error')
    
    if (success === 'instagram_connected') {
      alert('Instagram connected successfully!')
      loadSocialStatus()
      window.history.replaceState({}, '', window.location.pathname)
    } else if (success === 'youtube_connected') {
      alert('YouTube connected successfully!')
      loadSocialStatus()
      window.history.replaceState({}, '', window.location.pathname)
    } else if (error) {
      alert(`Connection failed: ${error}`)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const loadSocialStatus = async () => {
    try {
      const response = await socialService.getStatus()
      setSocialStatus(response.data)
    } catch (error) {
      console.error('Failed to load social status:', error)
    }
  }

  const handleConnectInstagram = async () => {
    setLoading(true)
    try {
      const response = await socialService.connectInstagram()
      if (response.data.authUrl) {
        window.location.href = response.data.authUrl
      }
    } catch (error) {
      alert('Failed to initiate Instagram connection. Please try again.')
      console.error(error)
      setLoading(false)
    }
  }

  const handleConnectYouTube = async () => {
    setLoading(true)
    try {
      const response = await socialService.connectYouTube()
      if (response.data.authUrl) {
        window.location.href = response.data.authUrl
      }
    } catch (error) {
      alert('Failed to initiate YouTube connection. Please try again.')
      console.error(error)
      setLoading(false)
    }
  }

  const handleSaveProfile = () => {
    // TODO: Implement profile save
    alert('Profile saved successfully!')
  }

  return (
    <DashboardLayout
      title="Profile & media kit"
      subtitle="Tell brands what makes you unique"
      sidebarItems={sidebarItems}
      actionSlot={<button className="cta" onClick={handleSaveProfile}>Save profile</button>}
    >
      <div className="profile-grid">
        <div className="card">
          <label className="upload-field">
            Profile picture
            <input type="file" />
          </label>
          <div className="grid two">
            <label>
              Name
              <input type="text" placeholder="Ayla Rivers" />
            </label>
            <label>
              Category
              <select>
                <option>Beauty</option>
                <option>Travel</option>
                <option>Fitness</option>
                <option>Tech</option>
              </select>
            </label>
          </div>
          <div className="grid two">
            <label>
              Location
              <input type="text" placeholder="Los Angeles, CA" />
            </label>
            <label>
              Tags / skills
              <input type="text" placeholder="Storytelling, AR filters" />
            </label>
          </div>
          <label>
            Bio
            <textarea rows={4} placeholder="Share your story, milestones, and tone." />
          </label>
          <div className="social-connect">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                  className={`cta ${socialStatus.instagram.connected ? 'ghost' : ''}`}
                  onClick={handleConnectInstagram}
                  disabled={loading || socialStatus.instagram.connected}
                  style={{ flex: 1 }}
                >
                  {socialStatus.instagram.connected ? (
                    <>✓ Instagram Connected {socialStatus.instagram.username && `(@${socialStatus.instagram.username})`}</>
                  ) : (
                    'Connect Instagram'
                  )}
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                  className={`cta ${socialStatus.youtube.connected ? 'ghost' : ''}`}
                  onClick={handleConnectYouTube}
                  disabled={loading || socialStatus.youtube.connected}
                  style={{ flex: 1 }}
                >
                  {socialStatus.youtube.connected ? (
                    <>✓ YouTube Connected {socialStatus.youtube.channelName && `(${socialStatus.youtube.channelName})`}</>
                  ) : (
                    'Connect YouTube'
                  )}
                </button>
              </div>
            </div>
            {socialStatus.instagram.connected || socialStatus.youtube.connected ? (
              <p className="tiny" style={{ marginTop: '8px', color: '#2b8b36' }}>
                Your social media accounts are connected! Metrics will sync automatically.
              </p>
            ) : (
              <p className="tiny" style={{ marginTop: '8px' }}>
                Connect your accounts to automatically sync follower counts and engagement rates.
              </p>
            )}
          </div>
          <div className="grid two">
            <label>
              Instagram
              <input type="url" placeholder="https://instagram.com/ayla" />
            </label>
            <label>
              TikTok
              <input type="url" placeholder="https://tiktok.com/@ayla" />
            </label>
            <label>
              YouTube
              <input type="url" placeholder="https://youtube.com/@ayla" />
            </label>
            <label>
              X / Twitter
              <input type="url" placeholder="https://x.com/ayla" />
            </label>
          </div>
        </div>
        <div className="card rates-card">
          <h3>Rates</h3>
          <label>
            Reel
            <input type="number" placeholder="$950" />
          </label>
          <label>
            Story set
            <input type="number" placeholder="$350" />
          </label>
          <label>
            Grid post
            <input type="number" placeholder="$650" />
          </label>
          <label>
            UGC bundle
            <input type="number" placeholder="$1,200" />
          </label>
          <button className="cta ghost">Generate AI suggestions</button>
        </div>
      </div>
    </DashboardLayout>
  )
}

