import { Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { LandingPage } from './pages/LandingPage'
import { AuthPage } from './pages/auth/AuthPage'
import { GoogleCallback } from './pages/auth/GoogleCallback'
import { InfluencerDashboard } from './pages/influencer/InfluencerDashboard'
import { InfluencerProfile } from './pages/influencer/InfluencerProfile'
import { PortfolioPage } from './pages/influencer/PortfolioPage'
import { BrowseCampaigns } from './pages/influencer/BrowseCampaigns'
import { CampaignApplication } from './pages/influencer/CampaignApplication'
import { EarningsPage } from './pages/influencer/EarningsPage'
import { BrandDashboard } from './pages/brand/BrandDashboard'
import { CreateCampaign } from './pages/brand/CreateCampaign'
import { ManageCampaigns } from './pages/brand/ManageCampaigns'
import { BrowseInfluencers } from './pages/brand/BrowseInfluencers'
import { PaymentsPage as BrandPayments } from './pages/brand/PaymentsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { ManageUsers } from './pages/admin/ManageUsers'
import { AdminCampaigns } from './pages/admin/AdminCampaigns'
import { ReportsPage } from './pages/admin/ReportsPage'
import { AdminPayments } from './pages/admin/AdminPayments'
import { FloatingAssistant } from './components/FloatingAssistant'
import { VerifyOTP } from './pages/auth/VerifyOTP'
import { UserProfileView } from './pages/UserProfileView'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuthStore } from './store/authStore'
import { MessagesPage } from './pages/MessagesPage'
import { DiscoverUsers } from './pages/DiscoverUsers'
import { FollowersFollowingPage } from './pages/FollowersFollowingPage'
import './App.css'

function App() {
  const { initialize } = useAuthStore()

  // Initialize auth state on app load
  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div className="app">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
        <Route path="/auth/callback" element={<GoogleCallback />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        

        {/* Influencer Routes */}
        <Route 
          path="/influencer/dashboard" 
          element={
            <ProtectedRoute allowedTypes={['influencer']}>
              <InfluencerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/influencer/profile" 
          element={
            <ProtectedRoute allowedTypes={['influencer']}>
              <InfluencerProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/influencer/portfolio" 
          element={
            <ProtectedRoute allowedTypes={['influencer']}>
              <PortfolioPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/influencer/campaigns" 
          element={
            <ProtectedRoute allowedTypes={['influencer']}>
              <BrowseCampaigns />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/influencer/campaigns/apply" 
          element={
            <ProtectedRoute allowedTypes={['influencer']}>
              <CampaignApplication />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/influencer/messaging" 
          element={
            <ProtectedRoute allowedTypes={['influencer']}>
              <MessagesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/influencer/earnings" 
          element={
            <ProtectedRoute allowedTypes={['influencer']}>
              <EarningsPage />
            </ProtectedRoute>
          } 
        />

        {/* Brand Routes */}
        <Route 
          path="/brand/dashboard" 
          element={
            <ProtectedRoute allowedTypes={['brand']}>
              <BrandDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/brand/create-campaign" 
          element={
            <ProtectedRoute allowedTypes={['brand']}>
              <CreateCampaign />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/brand/manage-campaigns" 
          element={
            <ProtectedRoute allowedTypes={['brand']}>
              <ManageCampaigns />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/brand/browse-influencers" 
          element={
            <ProtectedRoute allowedTypes={['brand']}>
              <BrowseInfluencers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/brand/messaging" 
          element={
            <ProtectedRoute allowedTypes={['brand']}>
              <MessagesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/brand/payments" 
          element={
            <ProtectedRoute allowedTypes={['brand']}>
              <BrandPayments />
            </ProtectedRoute>
          } 
        />

        {/* Analytics (Both Influencer and Brand) */}
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute allowedTypes={['influencer', 'brand']}>
              <AnalyticsPage />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <ManageUsers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/campaigns" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <AdminCampaigns />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/payments" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <AdminPayments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <ReportsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/discover" 
          element={
            <ProtectedRoute>
              <DiscoverUsers />
            </ProtectedRoute>
          } 
        />

        {/* Discover page */}
  <Route path="/discover" element={<ProtectedRoute><DiscoverUsers /></ProtectedRoute>} />
  
  {/* User profile view */}
  <Route path="/profile/:userId" element={<ProtectedRoute><UserProfileView /></ProtectedRoute>} />
  
  {/* Followers/Following lists */}
  <Route path="/profile/:userId/connections" element={<ProtectedRoute><FollowersFollowingPage /></ProtectedRoute>} />

        {/* Followers/Following page */}
      <Route 
        path="/profile/:userId/connections" 
        element={
          <ProtectedRoute>
            <FollowersFollowingPage />
          </ProtectedRoute>
        } 
      />
      
        {/* User profile view page */}
      <Route 
        path="/profile/:userId" 
        element={
          <ProtectedRoute>
            <UserProfileView />
          </ProtectedRoute>
        } 
      />
        {/* 404 - Redirect to Landing */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
      <FloatingAssistant />
    </div>
  )
}

export default App