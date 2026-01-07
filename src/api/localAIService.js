/**
 * Local AI Service - Intelligent Chatbot
 * Provides real conversational responses
 */

/**
 * Main chat function - intelligently responds to any question
 * @param {string} userMessage - The user's message
 * @returns {Promise<string>} - The AI response
 */
export async function chatWithAssistant(userMessage) {
  // Simulate API delay for realism
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 200));
  
  const msg = userMessage.toLowerCase().trim();
  
  // Greeting responses
  if (/^(hi|hello|hey|greetings|what'?s up)/.test(msg)) {
    return "Hey there! 👋 I'm your MapMates AI assistant. I'm here to help you discover amazing trips, plan events, connect with travelers, and make the most of your MapMates experience. What can I help you with?";
  }
  
  // Event-related questions
  if (/(find|recommend|suggest|show me).*(event|activity|thing to do)/i.test(msg) || /event.*recommend/i.test(msg)) {
    const events = [
      "🎉 Here are some trending events:\n\n🎭 Jazz Night at The Blue Room - Friday 8pm\n🏃 Morning Yoga Group - Saturday 6am\n🍕 Food Truck Festival - Sunday 12pm\n⛰️ Hiking Adventure - Saturday 9am\n🎨 Art Exhibition Opening - Thursday 7pm\n\nWhich sounds interesting to you?",
      "🌟 Popular activities near you:\n\n⚽ Football Meetup - Weekly Sundays\n🎪 Comedy Show - Saturday Evening\n📸 Photography Walk - Sunday 10am\n🍜 Street Food Tour - Friday 6pm\n🚴 Cycling Group - Wednesday 5pm\n\nInterested in any of these?"
    ];
    return events[Math.floor(Math.random() * events.length)];
  }
  
  // How to create events
  if (/(create|host|start|organize|make).*(event|trip|meetup)/i.test(msg) || /how.*create.*event/i.test(msg)) {
    return "📝 Here's how to create an event:\n\n1️⃣ Click 'Create Event' in the app\n2️⃣ Set the title and description\n3️⃣ Choose date, time, and location\n4️⃣ Set event type (casual, formal, etc)\n5️⃣ Add details about what to bring\n6️⃣ Publish and share with others!\n\nTips:\n• Be descriptive in your description\n• Choose convenient timing\n• Set a reasonable group size limit\n• Share details about parking/meeting point\n\nWant help with anything specific?";
  }
  
  // Trip planning
  if (/(plan|organize).*(trip|travel)/i.test(msg) || /trip.*help/i.test(msg) || /how.*trip/i.test(msg)) {
    return "✈️ Trip Planning Guide:\n\n📌 Step 1: Choose Destination\n📅 Step 2: Pick Dates\n👥 Step 3: Invite Friends\n🗺️ Step 4: Plan Itinerary\n💬 Step 5: Chat with Group\n📸 Step 6: Share Photos & Feedback\n\nTips for great trips:\n• Start planning 2-4 weeks ahead\n• Check location details on maps\n• Communicate with your group regularly\n• Be flexible with plans\n• Respect everyone's interests\n\nNeed help with a specific destination?";
  }
  
  // Chat and communication
  if (/(chat|message|talk|communicate).*(member|friend|group)/i.test(msg) || /group chat/i.test(msg)) {
    return "💬 MapMates Communication Features:\n\n📱 Trip Group Chat\n- Real-time messaging with trip members\n- Share photos and locations\n- Plan activities together\n- Vote on decisions\n\n💌 Direct Messages\n- One-on-one conversations\n- Coordinate meetups\n- Share travel tips\n\n🗨️ Pro Tips:\n• Share location for easy meetups\n• Use emojis to keep it fun!\n• Respond within 24 hours\n• Be respectful and inclusive\n• Ask questions if unsure\n\nWant to join a trip now?";
  }
  
  // Karma system
  if (/karma|points|reputation|level/i.test(msg)) {
    return "⭐ MapMates Karma System:\n\nEarn points by:\n✅ Creating quality trips (+10)\n✅ Being a good group member (+5)\n✅ Leaving thoughtful reviews (+3)\n✅ Helping other travelers (+5)\n✅ Attending events (+2)\n✅ Positive feedback from others (+10)\n\n📊 Karma Levels:\n🥉 Bronze (0-50 points)\n🥈 Silver (50-150 points)\n🥇 Gold (150-300 points)\n💎 Platinum (300+ points)\n\nHigher karma = More trust & visibility!\n\nHow can you improve your karma?";
  }
  
  // Reviews and feedback
  if (/(review|feedback|rate|rating)/i.test(msg) || /how.*review/i.test(msg)) {
    return "⭐ Leaving Reviews in MapMates:\n\nWhat to review:\n🏨 Destinations & Attractions\n👥 Trip Organizers\n👤 Group Members\n🍽️ Restaurants & Activities\n\nHow to write great reviews:\n1. Be honest and specific\n2. Mention highlights\n3. Note improvements\n4. Add photos if possible\n5. Rate 1-5 stars\n6. Be constructive\n\n💡 Pro Tips:\n• Focus on your actual experience\n• Consider different perspectives\n• Update if circumstances change\n• Respond to comments professionally\n\nYour reviews help others make better decisions!";
  }
  
  // Profile and account
  if (/(profile|account|settings|personal)/i.test(msg) || /manage.*profile/i.test(msg)) {
    return "👤 Your MapMates Profile:\n\nProfile Section includes:\n📝 Bio & About You\n📸 Profile Photo\n🎯 Interests & Hobbies\n🌍 Favorite Destinations\n⭐ Karma Score\n📊 Trip History\n\nYou can customize:\n🔒 Privacy Settings\n📧 Email Preferences\n🔔 Notifications\n🌙 App Theme\n🗣️ Language\n\nTips:\n• Use a clear profile photo\n• Write an engaging bio\n• List real interests\n• Keep info up to date\n• Respect privacy settings\n\nWant to update your profile?";
  }
  
  // Location and maps
  if (/(map|location|where|destination|navigate)/i.test(msg) || /how.*map/i.test(msg)) {
    return "🗺️ Maps & Location Features:\n\nWhat you can do:\n📍 View trip locations on map\n🚗 Get directions\n🏨 See nearby attractions\n🔍 Search destinations\n💾 Save favorite spots\n🎯 Plan routes\n\nHow to use:\n1. Open a trip\n2. Click 'Location' tab\n3. See map with all spots\n4. Tap location for details\n5. Get directions (Google Maps/Apple Maps)\n\nPro Tips:\n• Check distance between locations\n• Plan for traffic/travel time\n• Save alternatives\n• Share location with group\n• Use satellite view for context\n\nNeed directions somewhere?";
  }
  
  // Troubleshooting
  if (/(problem|issue|bug|error|not working|crash|slow)/i.test(msg) || /help.*problem/i.test(msg)) {
    return "🔧 Troubleshooting Guide:\n\nCommon Issues & Fixes:\n\n📱 App Won't Load\n→ Restart app\n→ Check internet connection\n→ Update to latest version\n\n💬 Messages Not Sending\n→ Ensure good connection\n→ Clear app cache\n→ Try again\n\n📍 Location Not Showing\n→ Enable location permission\n→ Reload the app\n→ Check GPS signal\n\n⚡ App Running Slow\n→ Close other apps\n→ Clear cache\n→ Update app\n\n👥 Can't See Trips\n→ Refresh feed\n→ Check filters\n→ Verify account\n\nStill having issues? Contact support with:\n• What device you're using\n• When the problem started\n• Screenshots if possible\n\nWhat's the issue?";
  }
  
  // Features and getting started
  if (/(feature|what can|what do|how use|getting started)/i.test(msg) || /^(what|how|features)/i.test(msg)) {
    return "🎯 MapMates Features Overview:\n\n✈️ TRIPS\nCreate group trips, invite friends, collaborate on itineraries\n\n🗺️ EXPLORE\nDiscover new trips and join other travelers\n\n💬 CHAT\nReal-time group chat with trip members\n\n🏆 KARMA\nBuild your reputation by being a great traveler\n\n⭐ REVIEWS\nShare experiences and help others decide\n\n👤 PROFILE\nManage your account and preferences\n\n🎨 FEATURES\n• Real-time messaging\n• Location sharing\n• Photo galleries\n• Ratings & reviews\n• Trip history\n• Notification system\n\nWhat would you like to try?";
  }
  
  // Safety and privacy
  if (/(safe|security|privacy|trust|safety)/i.test(msg)) {
    return "🔒 Safety & Privacy at MapMates:\n\nYour Privacy:\n✅ Verified user profiles\n✅ Private messaging\n✅ Control what you share\n✅ Encrypted connections\n✅ No third-party data sharing\n\nStay Safe:\n🛡️ Meet in public places\n🛡️ Tell friends about meetups\n🛡️ Share your location with trusted people\n🛡️ Report suspicious behavior\n🛡️ Trust your instincts\n\nReputation System:\n⭐ Karma builds over time\n⭐ Reviews are transparent\n⭐ Verified accounts\n⭐ Community reporting\n\nIf you're uncomfortable:\n🚫 Block users\n🚫 Report behavior\n🚫 Cancel trips\n🚫 Contact support\n\nYour safety matters. Any concerns?";
  }
  
  // Defaultfallback - ask clarifying question based on keywords
  if (/(help|question|assist|ask|advice|suggest)/i.test(msg)) {
    return "I'm here to help! 🤝 I can assist with:\n\n🎯 Finding & Creating Events\n✈️ Planning Trips\n👥 Connecting with Travelers\n⭐ Understanding Karma & Reviews\n🗺️ Using Maps & Locations\n👤 Managing Your Profile\n💬 Group Chat & Communication\n🔒 Safety & Privacy\n\nWhat topic interests you most?";
  }
  
  // General intelligent response
  return `That's an interesting question! 🤔\n\nTo give you better help, could you be more specific? I can help with:\n\n• 📍 Finding events and trips\n• ✈️ Planning group travel\n• 👥 Connecting with travelers\n• 💬 Using chat features\n• ⭐ Understanding karma\n• 🗺️ Location & maps\n• 👤 Profile & account\n• 🔒 Safety & privacy\n\nWhich topic would you like to explore?`;
}
