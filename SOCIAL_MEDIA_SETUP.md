# 📱 Social Media Integration Setup Guide

This guide will help you set up Instagram and YouTube OAuth integration for the platform.

## 🔑 Prerequisites

- Instagram Developer Account
- YouTube/Google Cloud Console Account
- Backend server running
- Environment variables configured

## 📸 Instagram Setup

### Step 1: Create Instagram App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing
3. Add "Instagram Basic Display" product
4. Go to Settings → Basic
5. Add your OAuth redirect URI:
   ```
   http://localhost:5000/api/social/instagram/callback
   ```
   (For production, use your production URL)

### Step 2: Get Credentials

1. Go to Settings → Basic
2. Copy your **App ID** (Client ID)
3. Copy your **App Secret** (Client Secret)
4. Add to your `.env` file:
   ```env
   INSTAGRAM_CLIENT_ID=your_instagram_app_id
   INSTAGRAM_CLIENT_SECRET=your_instagram_app_secret
   ```

### Step 3: Configure OAuth Redirect

1. In Facebook App Settings → Basic
2. Add to "Valid OAuth Redirect URIs":
   ```
   http://localhost:5000/api/social/instagram/callback
   https://yourdomain.com/api/social/instagram/callback
   ```

### Step 4: Test Users (Development)

1. Go to Roles → Roles
2. Add Instagram Testers
3. Test users must accept the invitation
4. Only test users can connect during development

### Step 5: App Review (Production)

For production, you need to submit your app for review:
1. Go to App Review → Permissions and Features
2. Request `instagram_basic` permission
3. Submit for review (can take several days)

## 🎥 YouTube Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "YouTube Data API v3"

### Step 2: Create OAuth Credentials

1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Add authorized redirect URIs:
   ```
   http://localhost:5000/api/social/youtube/callback
   https://yourdomain.com/api/social/youtube/callback
   ```
5. Copy **Client ID** and **Client Secret**

### Step 3: Add to Environment Variables

Add to your `.env` file:
```env
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
```

### Step 4: Configure OAuth Consent Screen

1. Go to APIs & Services → OAuth consent screen
2. Choose "External" (unless you have Google Workspace)
3. Fill in app information
4. Add scopes:
   - `https://www.googleapis.com/auth/youtube.readonly`
   - `https://www.googleapis.com/auth/userinfo.profile`
5. Add test users (for development)
6. Submit for verification (for production)

## 🔧 Backend Configuration

### Environment Variables

Add these to your `backend/.env`:

```env
# Instagram
INSTAGRAM_CLIENT_ID=your_instagram_app_id
INSTAGRAM_CLIENT_SECRET=your_instagram_app_secret

# YouTube
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret

# Backend URL (for OAuth callbacks)
BACKEND_URL=http://localhost:5000
# For production: https://your-backend-domain.com

# Frontend URL (for redirects after OAuth)
FRONTEND_URL=http://localhost:5173
# For production: https://your-frontend-domain.com
```

### Install Dependencies

The backend already includes the necessary packages. If you need to reinstall:

```bash
cd backend
npm install
```

## 🧪 Testing

### Test Instagram Connection

1. Start your backend server
2. Log in as an influencer
3. Go to Profile page
4. Click "Connect Instagram"
5. You should be redirected to Instagram OAuth
6. After authorization, you'll be redirected back
7. Check that Instagram is now connected

### Test YouTube Connection

1. Start your backend server
2. Log in as an influencer
3. Go to Profile page
4. Click "Connect YouTube"
5. You should be redirected to Google OAuth
6. After authorization, you'll be redirected back
7. Check that YouTube is now connected

## 🐛 Troubleshooting

### Instagram Issues

**"Invalid redirect URI"**
- Check that your redirect URI matches exactly in Facebook App settings
- Include protocol (http:// or https://)
- Check for trailing slashes

**"App not in development mode"**
- Add test users in Roles → Roles
- Test users must accept invitation
- Only test users can connect in development

**"Access token expired"**
- Instagram tokens expire after 60 days
- Implement token refresh logic
- Re-authenticate users when needed

### YouTube Issues

**"Redirect URI mismatch"**
- Check authorized redirect URIs in Google Cloud Console
- Must match exactly (including protocol and port)

**"Access blocked: This app's request is invalid"**
- Check OAuth consent screen configuration
- Add test users for development
- Submit for verification for production

**"Insufficient permissions"**
- Ensure YouTube Data API v3 is enabled
- Check that required scopes are added

## 🔒 Security Notes

1. **Never commit credentials** to version control
2. **Use environment variables** for all secrets
3. **Store tokens securely** (consider encryption)
4. **Implement token refresh** for long-lived sessions
5. **Validate redirect URIs** to prevent attacks
6. **Use HTTPS** in production

## 📊 What Gets Synced

### Instagram
- Username
- Follower count (via separate API call)
- Profile picture
- Basic profile info

### YouTube
- Channel name
- Channel ID
- Subscriber count
- Channel statistics

## 🚀 Production Checklist

- [ ] Instagram app submitted for review
- [ ] YouTube OAuth consent screen verified
- [ ] All redirect URIs updated to production URLs
- [ ] Environment variables set in production
- [ ] HTTPS enabled
- [ ] Token refresh logic implemented
- [ ] Error handling tested
- [ ] User flow tested end-to-end

## 📚 Additional Resources

- [Instagram Basic Display API Docs](https://developers.facebook.com/docs/instagram-basic-display-api)
- [YouTube Data API Docs](https://developers.google.com/youtube/v3)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)

---

**Need Help?** Check the main README.md or open an issue on GitHub.

