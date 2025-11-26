# 🤖 AI Assistant Setup Guide

The AI assistant (Lumi) helps users with queries about the platform, campaigns, profiles, and more.

## 🎯 Features

- Answers questions about the platform
- Helps with campaign creation
- Provides influencer recommendations
- Assists with profile optimization
- Offers pricing guidance
- General platform support

## ⚙️ Setup Options

### Option 1: OpenAI (Recommended)

The AI assistant can use OpenAI's GPT models for intelligent responses.

#### Step 1: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys
4. Create a new secret key
5. Copy the key (starts with `sk-`)

#### Step 2: Add to Environment Variables

Add to your `backend/.env`:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo
```

**Note:** `OPENAI_MODEL` is optional. Defaults to `gpt-3.5-turbo`. You can use:
- `gpt-3.5-turbo` (cheaper, faster)
- `gpt-4` (more capable, more expensive)
- `gpt-4-turbo` (latest, best performance)

#### Step 3: Install OpenAI Package

The package is already in `package.json`. If you need to install:

```bash
cd backend
npm install openai
```

#### Step 4: Restart Backend

```bash
npm run dev
```

### Option 2: Rule-Based (No API Key Required)

If you don't have an OpenAI API key, the AI assistant will use intelligent rule-based responses. This works out of the box without any setup!

The rule-based system handles:
- Common questions about the platform
- Campaign creation guidance
- Profile optimization tips
- Influencer discovery advice
- Pricing recommendations
- General support queries

## 🧪 Testing

### Test the AI Assistant

1. Start your backend server
2. Log in to the platform
3. Click the floating assistant button (bottom right)
4. Try asking:
   - "How do I connect my Instagram?"
   - "Suggest influencers for my campaign"
   - "How to improve my profile?"
   - "What should I charge for posts?"

### Expected Behavior

**With OpenAI:**
- Intelligent, contextual responses
- Handles complex queries
- Natural conversation flow

**Without OpenAI (Rule-Based):**
- Pre-programmed responses for common queries
- Keyword-based matching
- Helpful guidance for platform features

## 💡 Example Queries

### For Influencers
- "How do I connect my Instagram?"
- "What should I charge for a reel?"
- "How to improve my profile?"
- "How do I apply to campaigns?"
- "What makes a good application?"

### For Brands
- "How to create a campaign?"
- "How to find influencers?"
- "What's a good campaign budget?"
- "How to measure ROI?"
- "What should I include in a brief?"

### General
- "How does the platform work?"
- "What features are available?"
- "How do I get started?"
- "Help with navigation"

## 🔧 Customization

### Modify AI Responses

Edit `backend/src/controllers/aiController.js`:

1. **System Prompt**: Change the `systemPrompt` variable to customize the AI's personality and knowledge
2. **Rule-Based Responses**: Modify the `getRuleBasedResponse` function to add custom responses
3. **Model Settings**: Adjust `temperature` and `max_tokens` for different response styles

### Add Custom Queries

In `getRuleBasedResponse` function, add new conditions:

```javascript
if (lowerMessage.includes('your_keyword')) {
  return 'Your custom response here';
}
```

## 📊 Response Quality

### OpenAI (GPT-3.5-turbo or GPT-4)
- ✅ Handles complex, nuanced questions
- ✅ Contextual understanding
- ✅ Natural conversation
- ✅ Can learn from context
- ⚠️ Requires API key
- ⚠️ Costs per request

### Rule-Based
- ✅ Free, no API key needed
- ✅ Fast responses
- ✅ Predictable answers
- ✅ Works offline
- ⚠️ Limited to pre-programmed responses
- ⚠️ Keyword matching only

## 🚀 Production Recommendations

1. **Use OpenAI** for better user experience
2. **Set up rate limiting** to control costs
3. **Monitor API usage** in OpenAI dashboard
4. **Implement caching** for common queries
5. **Add fallback** to rule-based if API fails
6. **Log conversations** for improvement

## 💰 Cost Estimation

### OpenAI Pricing (as of 2024)

- **GPT-3.5-turbo**: ~$0.002 per 1K tokens
- **GPT-4**: ~$0.03 per 1K tokens (input), ~$0.06 per 1K tokens (output)

**Example:**
- Average query: ~100 tokens input, ~200 tokens output
- GPT-3.5-turbo: ~$0.0006 per query
- 1000 queries: ~$0.60

### Cost Optimization

1. Use GPT-3.5-turbo for most queries
2. Set `max_tokens` to limit response length
3. Cache common responses
4. Use rule-based for simple queries
5. Implement rate limiting

## 🔒 Security

1. **Never expose API keys** in frontend code
2. **Store keys in environment variables**
3. **Validate user input** before sending to AI
4. **Sanitize AI responses** before displaying
5. **Rate limit** to prevent abuse
6. **Monitor usage** for anomalies

## 🐛 Troubleshooting

### "OpenAI API error"
- Check API key is correct
- Verify you have credits in OpenAI account
- Check network connectivity
- Review API rate limits

### "AI not responding"
- Check backend logs
- Verify AI route is accessible
- Test with rule-based mode
- Check authentication

### "Responses are slow"
- Use GPT-3.5-turbo instead of GPT-4
- Reduce `max_tokens`
- Implement caching
- Check network latency

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/pricing)
- [GPT Best Practices](https://platform.openai.com/docs/guides/gpt-best-practices)

---

**The AI assistant is ready to help your users! 🚀**

