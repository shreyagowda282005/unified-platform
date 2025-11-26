// AI Assistant Controller
// Enhanced with better responses and optional OpenAI integration

exports.chat = async (req, res) => {
  try {
    const { message, context } = req.body;
    const userType = req.user?.userType || 'influencer';

    let response = '';

    // Check if OpenAI is configured
    if (process.env.OPENAI_API_KEY) {
      try {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const systemPrompt = `You are Lumi, an AI assistant for an influencer marketing platform. Help users with:
- Campaign management and optimization
- Influencer discovery and matching
- Profile optimization
- Content strategy
- Analytics and insights
- Platform navigation

User type: ${userType}
Be helpful, concise, and professional.`;

        const completion = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 300,
          temperature: 0.7,
        });

        response = completion.choices[0].message.content;
      } catch (openaiError) {
        console.error('OpenAI error:', openaiError);
        // Fall back to rule-based responses
        response = getRuleBasedResponse(message, userType);
      }
    } else {
      // Use rule-based responses
      response = getRuleBasedResponse(message, userType);
    }

    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function getRuleBasedResponse(message, userType) {
  const lowerMessage = message.toLowerCase();

  // Influencer queries
  if (userType === 'influencer') {
    if (lowerMessage.includes('suggest') || lowerMessage.includes('recommend') || lowerMessage.includes('find')) {
      return 'I can help you find the right campaigns! Look for campaigns that match your niche, audience demographics, and content style. Check the campaign requirements carefully and ensure you can deliver on time. Would you like me to help you filter campaigns?';
    }
    if (lowerMessage.includes('profile') || lowerMessage.includes('optimize') || lowerMessage.includes('improve')) {
      return 'To optimize your profile: 1) Add high-quality portfolio images/videos, 2) Write a compelling bio highlighting your unique value, 3) Connect your Instagram and YouTube accounts for automatic metrics, 4) Set competitive rates based on your engagement, 5) Add relevant categories and tags.';
    }
    if (lowerMessage.includes('rate') || lowerMessage.includes('pricing') || lowerMessage.includes('charge')) {
      return 'Your rates should reflect your engagement rate, follower count, and content quality. Generally: Micro-influencers (1K-10K): $50-$500, Mid-tier (10K-100K): $500-$5K, Macro (100K+): $5K+. Consider your engagement rate and niche when setting rates.';
    }
    if (lowerMessage.includes('application') || lowerMessage.includes('apply')) {
      return 'When applying to campaigns: 1) Read the brief carefully, 2) Propose a rate that reflects your value, 3) Write a personalized message explaining why you\'re a good fit, 4) Highlight relevant past work, 5) Be professional and responsive.';
    }
    if (lowerMessage.includes('instagram') || lowerMessage.includes('youtube') || lowerMessage.includes('connect')) {
      return 'Connecting your social media accounts helps brands see your real metrics and increases your credibility. Go to your profile page and click "Connect Instagram" or "Connect YouTube" to link your accounts. This will automatically sync your follower counts and engagement rates.';
    }
  }

  // Brand queries
  if (userType === 'brand') {
    if (lowerMessage.includes('campaign') || lowerMessage.includes('create') || lowerMessage.includes('launch')) {
      return 'To create a successful campaign: 1) Define clear objectives and KPIs, 2) Set a realistic budget, 3) Write a detailed brief with deliverables, 4) Specify target audience and niche, 5) Set clear timelines. Be transparent about expectations to attract quality influencers.';
    }
    if (lowerMessage.includes('influencer') || lowerMessage.includes('find') || lowerMessage.includes('discover')) {
      return 'When finding influencers: 1) Look for high engagement rates (3%+), 2) Check audience demographics match your target, 3) Review content quality and brand alignment, 4) Consider past campaign performance, 5) Verify follower authenticity. Use filters to narrow down by niche, location, and budget.';
    }
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
      return 'Campaign budgets vary by influencer tier: Micro (1K-10K): $50-$500, Mid-tier (10K-100K): $500-$5K, Macro (100K+): $5K+. Consider engagement rate, content quality, and deliverables when setting budget. Always negotiate based on value, not just follower count.';
    }
    if (lowerMessage.includes('roi') || lowerMessage.includes('measure') || lowerMessage.includes('analytics')) {
      return 'Measure campaign ROI by tracking: 1) Reach and impressions, 2) Engagement rate, 3) Click-through rates, 4) Conversions and sales, 5) Brand awareness metrics. Use our analytics dashboard to track performance in real-time.';
    }
  }

  // General queries
  if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('what')) {
    return 'I\'m Lumi, your AI assistant! I can help you with campaign management, influencer discovery, profile optimization, analytics, and platform navigation. What specific question do you have?';
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'Hello! I\'m Lumi, your AI assistant. How can I help you today? I can assist with campaigns, profiles, finding influencers, analytics, and more!';
  }

  // Default response
  return 'I understand you\'re asking about: "' + message + '". I can help with campaign management, influencer discovery, profile optimization, and platform features. Could you provide more details about what you need help with?';
}

// Example with OpenAI (uncomment and configure):
/*
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.chat = async (req, res) => {
  try {
    const { message, context } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant for an influencer marketing platform. Help users with campaign management, influencer discovery, and profile optimization.'
        },
        {
          role: 'user',
          content: message
        }
      ]
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/







