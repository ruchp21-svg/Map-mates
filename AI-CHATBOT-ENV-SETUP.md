# 🔧 AI Chatbot - Environment Setup Guide

## Quick Setup (2 minutes)

### Step 1: Get OpenAI API Key

1. **Visit OpenAI Platform**
   - Go to: https://platform.openai.com
   - Sign in (or create account - free credits included!)

2. **Navigate to API Keys**
   - Click on your profile (top right)
   - Select "API keys"
   - Or go directly: https://platform.openai.com/api/keys

3. **Create New Secret Key**
   - Click "+ Create new secret key"
   - Name it: "MapMates" (optional)
   - Copy the key (you can't see it again!)

**Your key should look like:**
```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 2: Add to Project

**Option A: Using `.env.local` (Recommended)**

1. Open project root directory
2. Create file named `.env.local` (note the dot at start)
3. Add this line:
```
REACT_APP_OPENAI_API_KEY=sk_your_actual_key_here
```
4. Save the file
5. Restart dev server: `npm start`

**Option B: Using `.env` (Less Secure)**

1. Edit existing `.env` file
2. Add:
```
REACT_APP_OPENAI_API_KEY=sk_your_actual_key_here
```
3. Save and restart

⚠️ **WARNING**: Never commit API keys to version control!
- `.env.local` is already in `.gitignore`
- Never push `.env` with real keys

### Step 3: Verify Installation

1. Start dev server: `npm start`
2. Open app in browser
3. Click 💬 button (bottom-right)
4. If you see welcome message → ✅ Success!
5. If you see error → API key not set correctly

---

## Testing the Setup

### Test in Floating Widget

```
1. Click 💬 button
2. Type: "Hello"
3. Should respond in 3-5 seconds
4. If error: Check console (F12) for details
```

### Test in Full Page

```
1. Click "💬 AI Chat" in navbar
2. Or visit: http://localhost:3001/ai-chat
3. Click "Recommend Events" button
4. Should get event suggestions
```

### Troubleshooting

**Error: "API key not configured"**
```
✓ Check .env.local exists
✓ Verify REACT_APP_OPENAI_API_KEY=sk_...
✓ Restart: npm start
✓ Clear browser cache (Ctrl+Shift+Delete)
```

**Error: "401 Unauthorized"**
```
✓ API key might be invalid
✓ Check you copied full key
✓ Try regenerating key in OpenAI dashboard
✓ Make sure key has API access
```

**Error: "429 Rate Limited"**
```
✓ Too many requests to OpenAI
✓ Wait a minute
✓ Upgrade account for higher limits
✓ Check usage at: https://platform.openai.com/usage
```

---

## File Structure

After setup, your project should have:

```
react-final-review10/
├── .env.local                          ← NEW (don't commit!)
├── src/
│   ├── api/
│   │   ├── openaiService.js            ← NEW
│   │   └── chatHistoryService.js       ← NEW
│   ├── components/
│   │   ├── AIChatbot.js                ← NEW
│   │   ├── AIChatbot.css               ← NEW
│   │   └── Navbar.js                   ← UPDATED
│   ├── pages/
│   │   ├── AIChatbotPage.js            ← NEW
│   │   ├── AIChatbotPage.css           ← NEW
│   │   └── ... (other pages)
│   └── App.js                          ← UPDATED
├── public/
├── package.json
└── ... (other files)
```

---

## Environment Variables Reference

### Required for AI Chatbot
```
REACT_APP_OPENAI_API_KEY=sk_your_key_here
```

### Optional (for Firebase)
```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
```
*These should already be in firebase.js*

### For Development
```
SKIP_PREFLIGHT_CHECK=true
GENERATE_SOURCEMAP=false
```
*Already in .env*

---

## Security Best Practices

### ✅ DO:
- ✓ Use `.env.local` for API keys
- ✓ Add `.env.local` to `.gitignore`
- ✓ Rotate keys regularly
- ✓ Monitor API usage
- ✓ Use environment variables in production
- ✓ Keep keys confidential

### ❌ DON'T:
- ✗ Commit `.env` with API keys
- ✗ Share keys in chat/email
- ✗ Hardcode keys in source
- ✗ Upload keys to public repos
- ✗ Use personal keys in production
- ✗ Log API keys

---

## Production Setup

### For Deployment (Vercel, Netlify, etc.)

**On Hosting Platform:**
1. Go to project settings
2. Add environment variables
3. Set: `REACT_APP_OPENAI_API_KEY=your_key`
4. Redeploy

**Via .env.production.local:**
```
REACT_APP_OPENAI_API_KEY=your_production_key
```
(This won't be committed)

**Backend API (Recommended for Production):**
```javascript
// Backend handles API key
// Frontend calls /api/chat endpoint
// More secure than client-side key
```

---

## Monitoring & Costs

### Check OpenAI Usage

1. Visit: https://platform.openai.com/usage
2. See:
   - Tokens used
   - Requests made
   - Cost incurred
3. Set limits if needed

### Pricing (as of Jan 2026)

**GPT-3.5-turbo (current model):**
- Input: $0.0005 / 1K tokens
- Output: $0.0015 / 1K tokens

**Example:**
- 100 messages (short) = ~$0.01
- 1000 messages = ~$0.10
- Average user: $0.50-2.00/month

### Set Spending Limits

1. Go to: https://platform.openai.com/account/billing/limits
2. Set "Hard limit" to prevent overage
3. Get alerts at thresholds

---

## Upgrading to GPT-4 (Optional)

### Requirements
- OpenAI Plus account ($20/month)
- Or sufficient API credits

### In Code
Edit `src/api/openaiService.js`:
```javascript
model: 'gpt-4',  // Change from 'gpt-3.5-turbo'
```

### Cost Impact
GPT-4 is 10x more expensive but much smarter:
- Input: $0.03 / 1K tokens
- Output: $0.06 / 1K tokens

---

## Debugging

### Enable Debug Logging

Add to `src/api/openaiService.js`:
```javascript
console.log('Sending:', messages);  // See what's sent
console.log('Response:', data);     // See what's received
```

### Check Browser Console (F12)

Look for:
```
✅ OK - Messages logged normally
⚠️ WARN - Minor issues (can ignore)
❌ ERROR - Actual problems (need fixing)
```

### Common Errors & Solutions

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Invalid API key | Check key in .env.local |
| 429 Rate Limited | Too many requests | Wait or upgrade account |
| 500 Server Error | OpenAI issue | Wait, try again |
| CORS Error | Browser security | Use backend proxy |
| Timeout | Network slow | Check internet |

---

## FAQ

**Q: Is my API key safe?**
A: Yes! `.env.local` is never committed. Only you have access.

**Q: What if I lose my API key?**
A: Regenerate it in OpenAI dashboard. Old one stops working.

**Q: How much will it cost?**
A: ~$0.01 per 100 messages with GPT-3.5 (very cheap).

**Q: Can I use this in production?**
A: Yes! Just set environment variables on hosting platform.

**Q: Do I need a paid OpenAI account?**
A: No! Free trial includes $5 in credits.

**Q: How do I monitor usage?**
A: Check https://platform.openai.com/usage anytime.

---

## Next Steps

1. ✅ Create `.env.local`
2. ✅ Add your API key
3. ✅ Restart dev server
4. ✅ Test with 💬 button
5. ✅ Read `AI-CHATBOT-COMPLETE-GUIDE.md`
6. ✅ Customize as needed
7. ✅ Deploy to production!

---

## Help & Support

**Official Documentation:**
- OpenAI: https://platform.openai.com/docs
- React: https://react.dev
- Firebase: https://firebase.google.com/docs

**In This Project:**
- Complete Guide: `AI-CHATBOT-COMPLETE-GUIDE.md`
- Quick Start: `AI-CHATBOT-QUICKSTART.md`
- Implementation: `AI-CHATBOT-IMPLEMENTATION-SUMMARY.md`

---

**Questions?** Check the documentation files or review the source code!

Happy chatting! 🚀
