/**
 * MapMates AI Assistant
 * Provides helpful responses for all MapMates questions
 */

export async function chatWithClaudeAI(userMessage, conversationHistory = []) {
  // Simulate thinking time
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));
  
  const msg = userMessage.toLowerCase();
  
  // GREETINGS
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|what'?s up|howdy)/i.test(msg)) {
    return `Hey there! 👋 Welcome to MapMates AI Assistant!

I'm here to help you with everything about MapMates:

🗺️ **Trips** - Create, join, and manage group trips
👥 **Connect** - Find travel buddies and chat with members
⭐ **Karma** - Build your reputation
📝 **Reviews** - Share and read experiences
📍 **Locations** - Explore destinations on maps

What would you like to know about?`;
  }

  // HOW TO JOIN A TRIP
  if (/(join|participate|sign up for|enter|become part of).*(trip|journey|travel|adventure)/i.test(msg) || 
      /(how|can i|want to).*(join|participate)/i.test(msg)) {
    return `🎉 **How to Join a Trip in MapMates:**

**Step 1:** Go to **"Explore"** from the navigation menu

**Step 2:** Browse available trips or use the search/filter options

**Step 3:** Click on a trip that interests you to see details:
• Destination & dates
• Who's going
• Activities planned
• Cost breakdown

**Step 4:** Click the **"Join Trip"** button

**Step 5:** Wait for the trip organizer to approve your request (some trips are instant-join!)

**Step 6:** Once approved, you'll get access to:
• Group chat with other travelers
• Trip itinerary
• Location sharing
• Photo albums

💡 **Pro Tips:**
• Introduce yourself in the group chat
• Read the trip description carefully
• Check if dates work for you
• Look at the organizer's karma score

Ready to explore some trips? 🌍`;
  }

  // CREATE A TRIP
  if (/(create|start|organize|host|make|plan).*(trip|journey|travel|adventure|event)/i.test(msg) || 
      /how.*(create|start|organize|make)/i.test(msg)) {
    return `📝 **How to Create a Trip in MapMates:**

**Step 1:** Click **"Create Trip"** button in the app

**Step 2:** Fill in the trip details:
• 📌 **Title** - Make it catchy!
• 📍 **Destination** - Where are you going?
• 📅 **Dates** - Start and end dates
• 👥 **Group Size** - Max participants
• 💰 **Budget** - Estimated cost
• 📝 **Description** - What you'll do, what to bring

**Step 3:** Add photos of the destination (optional but recommended!)

**Step 4:** Set trip visibility:
• Public (anyone can see)
• Friends only
• Invite only

**Step 5:** Click **"Publish"** and share with friends!

💡 **Tips for Great Trips:**
• Be specific about meeting points
• List what's included/not included
• Respond quickly to join requests
• Keep the group chat active

Your karma increases when you organize successful trips! ⭐`;
  }

  // KARMA SYSTEM
  if (/(karma|points|reputation|score|level|rank|rating|badge)/i.test(msg)) {
    return `⭐ **MapMates Karma System Explained:**

Karma is your reputation score that shows how trustworthy and active you are!

**How to Earn Karma:**
• ✅ Create trips: +10 points
• ✅ Complete a trip: +15 points
• ✅ Get positive reviews: +5 points each
• ✅ Leave helpful reviews: +3 points
• ✅ Be active in group chats: +2 points
• ✅ Invite friends who join: +5 points

**Karma Levels:**
• 🥉 **Bronze** (0-50) - Newcomer
• 🥈 **Silver** (51-150) - Active Traveler
• 🥇 **Gold** (151-300) - Experienced Explorer
• 💎 **Platinum** (301-500) - Master Traveler
• 👑 **Diamond** (500+) - Elite MapMate

**Benefits of High Karma:**
• More visibility in search results
• Priority join requests
• Special badges on your profile
• Access to exclusive trips
• Other users trust you more!

Your current karma is shown on your profile page. Keep being active to level up! 🚀`;
  }

  // GROUP CHAT
  if (/(chat|message|talk|communicate|conversation|group chat|dm|direct message)/i.test(msg)) {
    return `💬 **MapMates Chat Features:**

**Trip Group Chat:**
Once you join a trip, you get access to the group chat where you can:
• 📱 Send messages to all trip members
• 📸 Share photos and videos
• 📍 Share your location
• 📋 Plan activities together
• 🗳️ Create polls for group decisions

**How to Use Chat:**
1. Open a trip you've joined
2. Click the **"Chat"** tab
3. Start messaging!

**Chat Tips:**
• Introduce yourself when you first join
• Share useful info about the destination
• Be respectful and friendly
• Respond within 24 hours
• Use emojis to keep it fun! 😊

**Private Messages:**
Click on any user's profile to send them a direct message.

Need help with something specific about chat? 💬`;
  }

  // PROFILE / ACCOUNT
  if (/(profile|account|settings|edit profile|my info|personal|photo|picture|bio)/i.test(msg)) {
    return `👤 **Managing Your MapMates Profile:**

**To View/Edit Your Profile:**
1. Click on your profile icon (top right)
2. Select **"Profile"** or **"Settings"**

**What You Can Customize:**
• 📸 **Profile Photo** - Use a clear, friendly photo
• ✍️ **Bio** - Tell others about yourself
• 🎯 **Interests** - Travel, hiking, food, etc.
• 🌍 **Locations** - Where you're from, places visited
• 🔗 **Social Links** - Connect Instagram, etc.

**Privacy Settings:**
• Who can see your profile
• Who can message you
• Trip history visibility
• Location sharing preferences

**Account Settings:**
• 📧 Email & password
• 🔔 Notification preferences
• 🌙 Dark/Light mode
• 🗣️ Language settings

Your profile is what other travelers see first - make it engaging! ✨`;
  }

  // REVIEWS / FEEDBACK
  if (/(review|feedback|rate|rating|experience|testimonial)/i.test(msg)) {
    return `⭐ **Reviews in MapMates:**

**Leaving a Review:**
After completing a trip, you can review:
• 🗺️ The trip itself
• 👤 The trip organizer
• 👥 Other participants
• 📍 Destinations visited

**How to Leave a Review:**
1. Go to **"Trip History"**
2. Find the completed trip
3. Click **"Leave Review"**
4. Rate 1-5 stars ⭐
5. Write your experience
6. Add photos (optional)
7. Submit!

**Writing Good Reviews:**
• Be honest and specific
• Mention highlights and challenges
• Help future travelers decide
• Be constructive, not mean
• Update if circumstances change

**Why Reviews Matter:**
• Help others make decisions
• Build organizer's reputation
• Earn karma points (+3)
• Improve the community

Your honest feedback makes MapMates better for everyone! 📝`;
  }

  // MAPS / LOCATION
  if (/(map|location|direction|navigate|gps|where|destination|place|address)/i.test(msg)) {
    return `🗺️ **Maps & Location in MapMates:**

**Location Features:**
• 📍 View trip destinations on interactive maps
• 🚗 Get directions to meeting points
• 📌 See all trip stops and attractions
• 📏 Calculate distances between locations
• 🛰️ Satellite and street view options

**How to Use Maps:**
1. Open any trip
2. Click the **"Location"** or **"Map"** tab
3. See all locations marked
4. Tap a pin for details
5. Click "Get Directions" for navigation

**Location Sharing:**
• Share your real-time location with group
• See where other trip members are
• Great for meetups and coordination
• Can be turned on/off in settings

**Pro Tips:**
• Download offline maps for areas without internet
• Check travel time between spots
• Look for nearby restaurants, hotels
• Save favorite locations

Need directions to a specific place? 📍`;
  }

  // EXPLORE / DISCOVER
  if (/(explore|discover|find|search|browse|look for|available|open|public)/i.test(msg)) {
    return `🔍 **Exploring Trips in MapMates:**

**The Explore Page:**
Find new adventures and travel buddies!

**How to Explore:**
1. Click **"Explore"** in navigation
2. Browse featured trips
3. Use filters to narrow down:
   • 📍 Location/Destination
   • 📅 Date range
   • 💰 Budget
   • 🏷️ Category (hiking, beach, city, etc.)
   • 👥 Group size

**Trip Categories:**
• 🏔️ Adventure & Hiking
• 🏖️ Beach & Relaxation
• 🏙️ City Exploration
• 🍕 Food & Culture
• 🎭 Events & Festivals
• 📸 Photography trips
• 🚴 Sports & Fitness

**Search Tips:**
• Try different keywords
• Check "Upcoming" vs "Popular"
• Look at organizer karma scores
• Read reviews from past trips

Found a trip you like? Click to view details and join! 🌍`;
  }

  // SAFETY / PRIVACY / TRUST
  if (/(safe|security|privacy|trust|protect|scam|fake|danger|concern|worry)/i.test(msg)) {
    return `🔒 **Safety & Privacy at MapMates:**

**Your Safety Matters:**
• ✅ Verified user profiles
• ✅ Karma & review system
• ✅ Report & block features
• ✅ Encrypted messaging
• ✅ No personal data shared publicly

**Meeting Safely:**
• 🛡️ Always meet in public places first
• 🛡️ Tell friends/family about your plans
• 🛡️ Trust your instincts
• 🛡️ Video chat before meeting in person
• 🛡️ Share live location with trusted contacts

**Privacy Controls:**
• Control who sees your profile
• Hide your exact location
• Manage notification settings
• Delete your data anytime

**If Something Feels Wrong:**
• 🚫 Block the user immediately
• 🚫 Report suspicious behavior
• 🚫 Leave the trip
• 🚫 Contact MapMates support

**Trust Indicators:**
• High karma score = more trustworthy
• Positive reviews from others
• Profile completeness
• Account verification badges

Your safety is our priority! ⚠️`;
  }

  // NOTIFICATIONS
  if (/(notification|alert|remind|update|news|inbox)/i.test(msg)) {
    return `🔔 **Notifications in MapMates:**

**Types of Notifications:**
• 📩 New messages in trip chats
• ✅ Join request approved/declined
• 👋 New member joined your trip
• ⭐ Someone reviewed you
• 📅 Trip reminders
• 💬 Direct messages
• 🎉 System announcements

**Managing Notifications:**
1. Go to **Settings > Notifications**
2. Toggle on/off by category
3. Set quiet hours
4. Choose email vs push notifications

**Notification Tips:**
• Enable for important trips
• Disable for completed trips
• Use quiet hours at night
• Check the notification bell regularly

Stay updated without being overwhelmed! 📱`;
  }

  // PROBLEMS / HELP / ISSUES
  if (/(problem|issue|bug|error|not working|crash|slow|help|support|trouble|fix|broken)/i.test(msg)) {
    return `🔧 **Troubleshooting & Support:**

**Common Issues & Fixes:**

**App Won't Load:**
• Check internet connection
• Refresh the page
• Clear browser cache
• Try a different browser

**Can't Join a Trip:**
• Trip might be full
• Organizer hasn't approved yet
• Check if dates overlap with other trips

**Messages Not Sending:**
• Check your connection
• Refresh the chat
• Try sending again

**Location Not Working:**
• Enable location permissions
• Check GPS is on
• Reload the page

**Profile Issues:**
• Make sure image is under 5MB
• Check all required fields
• Save changes before leaving

**Still Need Help?**
• Check the FAQ section
• Email: support@mapmates.com
• Use the in-app feedback form
• Response within 24-48 hours

We're here to help! 💪`;
  }

  // WHAT IS MAPMATES / ABOUT
  if (/(what is|about|explain|tell me about|describe).*(mapmates|this app|the app)/i.test(msg) ||
      /^(what|about|info|information)$/i.test(msg)) {
    return `🌍 **What is MapMates?**

MapMates is a social travel platform that helps you:

**🗺️ Plan Group Trips**
Create trips with friends or find travel buddies for adventures!

**👥 Connect with Travelers**
Meet like-minded people who share your travel interests.

**💬 Chat & Coordinate**
Group chats for trip planning and real-time communication.

**📍 Explore Destinations**
Interactive maps, location sharing, and navigation.

**⭐ Build Reputation**
Earn karma points and reviews for being a great travel companion.

**📸 Share Experiences**
Photos, reviews, and memories from your trips.

**Key Features:**
• Create and join trips
• Group chat with trip members
• Karma reputation system
• Reviews and ratings
• Interactive maps
• AI assistance (that's me! 🤖)

MapMates makes traveling together easy, safe, and fun! 

What would you like to explore first?`;
  }

  // THANK YOU
  if (/(thank|thanks|appreciate|helpful|great|awesome|perfect)/i.test(msg)) {
    return `You're welcome! 😊

I'm always here to help you with MapMates. Feel free to ask about:

• 🗺️ Creating or joining trips
• 👥 Connecting with travelers
• ⭐ Karma and reviews
• 📍 Maps and locations
• 🔒 Safety and privacy
• 🔧 Any issues you face

Happy traveling! 🌍✈️`;
  }

  // YES / NO / OK responses
  if (/^(yes|yeah|yep|sure|ok|okay|yup|definitely|absolutely)$/i.test(msg)) {
    return `Great! 👍 

What would you like to know more about?

• How to join a trip?
• How to create a trip?
• Using the chat features?
• Understanding karma?
• Exploring destinations?

Just ask! 😊`;
  }

  // GENERAL FALLBACK - Help with common topics
  return `I'd be happy to help you with that! 🤔

Here's what I can assist you with in **MapMates**:

**Getting Started:**
• 🗺️ How to join a trip
• ✏️ How to create a trip
• 👤 Setting up your profile

**Features:**
• 💬 Using group chat
• 📍 Maps and locations
• ⭐ Karma system
• 📝 Leaving reviews

**Help:**
• 🔒 Safety and privacy
• 🔧 Troubleshooting issues
• 🔔 Notification settings

**Just ask me a specific question like:**
• "How do I join a trip?"
• "What is karma?"
• "How do I create a trip?"
• "How does chat work?"

What would you like to know? 😊`;
}
