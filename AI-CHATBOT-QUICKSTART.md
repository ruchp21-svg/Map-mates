# 🤖 AI Chatbot - Quick Start

## ⚡ 60-Second Setup

### 1. Get OpenAI API Key (1 minute)
- Go to https://platform.openai.com/api/keys
- Create new API key
- Copy it

### 2. Add to Environment (30 seconds)
Create `.env.local` in project root:
```
REACT_APP_OPENAI_API_KEY=sk_your_key_here
```

### 3. Restart & Done! (30 seconds)
```bash
npm start
```

---

## 🎯 Start Using

### Option 1: Floating Widget
- Look for 💬 button in bottom-right corner
- Click to open/close
- Works on all pages

### Option 2: Full Page
- Click "💬 AI Chat" in navbar
- Get full conversation view
- Customize preferences

---

## 💡 Try These

### "Recommend events near Mumbai"
AI suggests events based on location

### "Help me create a hiking trip"
Step-by-step guidance for event creation

### "How do I join a trip?"
App usage instructions

### "What's trending nearby?"
Popular meetups and activities

---

## 🔧 Files Created

```
src/
├── api/
│   ├── openaiService.js          ← OpenAI API calls
│   └── chatHistoryService.js     ← Firestore persistence
├── components/
│   ├── AIChatbot.js              ← Floating widget
│   └── AIChatbot.css
└── pages/
    ├── AIChatbotPage.js          ← Full-screen page
    └── AIChatbotPage.css

Modified:
├── App.js                        ← Added route
└── Navbar.js                     ← Added "💬 AI Chat" link
```

---

## 🚀 Features

✅ ChatGPT-style UI  
✅ Event recommendations  
✅ Event creation help  
✅ App usage guidance  
✅ Trending meetups  
✅ Chat history  
✅ Preferences  
✅ Mobile responsive  

---

## ⚠️ If No API Key

The chatbot shows:
```
Sorry, I encountered an error. The OpenAI API key 
is not configured. Please set REACT_APP_OPENAI_API_KEY 
in your environment variables.
```

**Fix:** Add API key to `.env.local` and restart

---

## 📍 Access Points

1. **Floating Widget**: Bottom-right on any page
2. **Navbar Link**: "💬 AI Chat" 
3. **URL**: `/ai-chat` (when logged in)

---

## 💾 Your Data

- Chat history saved in Firestore
- One history per user
- You can clear anytime
- Messages linked to your account

---

## 🎓 Example Conversations

### Discovery
```
You: "I love photography and mountains"
AI: "Here are 5 photography trips this month..."
```

### Creation
```
You: "Create event for 20 hikers next weekend"
AI: "Great! A few questions:
     1. Which mountain range?
     2. Difficulty level?
     3. Duration (half-day, full-day)?"
```

### Learning
```
You: "How do groups work?"
AI: "Groups are collections of people going on 
     the same trip. You can..."
```

---

## ✨ Tips

- Describe your interests for better recommendations
- Set your location in settings for local suggestions
- Clear old chats to keep things organized
- Quick action buttons for common questions
- Messages persist across sessions

---

Ready to explore? Click 💬 and say hello! 🚀
