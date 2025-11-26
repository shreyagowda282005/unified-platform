export interface User {
  _id: string;
  email: string;
  userType: 'influencer' | 'brand' | 'admin';
}

export interface InfluencerProfile {
  _id: string;
  userId: string;
  name: string;
  profilePicture?: string;
  bio?: string;
  category?: string[];
  location?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };
  rates?: {
    perReel?: number;
    perStory?: number;
    perPost?: number;
  };
  tags?: string[];
  followerCount?: {
    instagram?: number;
    youtube?: number;
  };
  engagementRate?: number;
  averageReach?: number;
  portfolio?: Array<{
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    uploadedAt: Date;
  }>;
}

export interface BrandProfile {
  _id: string;
  userId: string;
  companyName: string;
  logo?: string;
  description?: string;
  website?: string;
  industry?: string;
  location?: string;
}

export interface Campaign {
  _id: string;
  brandId: string | BrandProfile;
  title: string;
  description: string;
  deliverables: string[];
  budget: number;
  niche?: string[];
  location?: string;
  deadline: Date;
  status: 'draft' | 'active' | 'closed' | 'completed';
  requirements?: string;
  timeline?: string;
  applicants?: Array<{
    influencerId: string | InfluencerProfile;
    appliedAt: Date;
    status: 'pending' | 'accepted' | 'rejected';
    message?: string;
  }>;
  createdAt: Date;
}

export interface Application {
  _id: string;
  campaignId: string | Campaign;
  influencerId: string | InfluencerProfile;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: Date;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  campaignId?: string;
  content: string;
  attachments?: Array<{ type: string; url: string }>;
  isRead: boolean;
  createdAt: Date;
}

export interface Payment {
  _id: string;
  campaignId: string | Campaign;
  brandId: string | BrandProfile;
  influencerId: string | InfluencerProfile;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: 'stripe' | 'razorpay' | 'bank_transfer';
  transactionId?: string;
  invoiceUrl?: string;
  paidAt?: Date;
  createdAt: Date;
}







