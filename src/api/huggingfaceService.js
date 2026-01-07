/**
 * Groq Inference API Service
 * Provides AI chatbot functionality using Groq's free inference API
 * No payment required - free tier is generous for testing
 * 
 * Setup:
 * 1. Go to https://console.groq.com/keys
 * 2. Create a free account and generate an API key
 * 3. Add to .env.local: REACT_APP_GROQ_API_KEY=your_key_here
 */

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// System prompts for different contexts
const SYSTEM_PROMPTS = {
  general: `You are a helpful travel assistant for MapMates, a trip-sharing app. 
Help users with trip planning, event recommendations, and app guidance. 
Be friendly, concise, and practical. Keep responses under 150 words.`,
  
  eventRecommendation: `You are a travel event recommendation expert. 
Suggest interesting activities, events, and attractions based on the location and user interests.
Include estimated costs and best times to visit. Keep recommendations relevant and practical.`,
  
  eventCreation: `You are helping users plan travel events.
Provide tips on organizing group activities, picking venues, and creating memorable experiences.
Ask clarifying questions if needed to provide better suggestions.`,
  
  tripPlanning: `You are a trip planning expert.
Help users organize their trips, create itineraries, and plan activities.
Consider budget, time constraints, and group preferences.`,
  
  trendingMeetups: `You are an expert on trending travel meetups and events.
Share information about popular destinations, seasonal events, and gathering spots.
Highlight unique experiences and upcoming trends in travel.`,
};

/**
 * Make a request to Groq API
 * @param {string} userMessage - The user's message
 * @param {string} context - The context type (general, eventRecommendation, etc.)
 * @returns {Promise<string>} - The AI response
 */
export async function callHuggingFaceAPI(userMessage, context = 'general') {
  if (!GROQ_API_KEY) {
    throw new Error(
      'Groq API key not configured. Please add REACT_APP_GROQ_API_KEY to .env.local. Get one free at https://console.groq.com/keys'
    );
  }

  try {
    const systemPrompt = SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.general;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || errorData.message || `API error: ${response.status}`;
      console.error('Groq API error:', errorMsg);
      throw new Error(errorMsg);
    }

    const data = await response.json();
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content.trim();
    }
    
    throw new Error('Unexpected response format from API');
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
}

/**
 * Get event recommendations for a location
 * @param {string} location - The trip destination
 * @param {string} interests - User interests/preferences
 * @returns {Promise<string>} - Recommendations
 */
export async function getEventRecommendations(location, interests = '') {
  const message = `Recommend 3-4 interesting events or activities in ${location}. 
${interests ? `User interests: ${interests}` : ''}
Keep it concise with estimated costs and timing.`;
  
  return callHuggingFaceAPI(message, 'eventRecommendation');
}

/**
 * Get help creating an event
 * @param {string} eventType - Type of event
 * @param {string} details - Event details
 * @returns {Promise<string>} - Event creation tips
 */
export async function getEventCreationHelp(eventType, details = '') {
  const message = `Help me create a ${eventType}. ${details}
Provide practical tips and suggestions.`;
  
  return callHuggingFaceAPI(message, 'eventCreation');
}

/**
 * Get trending meetup information
 * @param {string} location - Location of interest
 * @returns {Promise<string>} - Trending meetup info
 */
export async function getTrendingMeetups(location) {
  const message = `What are the trending travel meetups and group activities in ${location} right now?
Include popular spots where travelers gather.`;
  
  return callHuggingFaceAPI(message, 'trendingMeetups');
}

/**
 * Get general app usage guidance
 * @param {string} question - User's question
 * @returns {Promise<string>} - Guidance
 */
export async function getAppGuidance(question) {
  const appGuide = `MapMates is a trip-sharing platform where users can:
- Create and share trips
- Join others' trips
- Chat with trip members in group chats
- View trip locations on maps
- Leave trip reviews and ratings
- Earn karma points for helping others
- Provide feedback on trips and experiences`;
  
  const message = `User question about MapMates: "${question}"
Here's what MapMates offers: ${appGuide}
Answer the user's question helpfully.`;
  
  return callHuggingFaceAPI(message, 'general');
}

/**
 * Chat with the AI assistant (general purpose)
 * @param {string} message - User message
 * @returns {Promise<string>} - AI response
 */
export async function chatWithAssistant(message) {
  return callHuggingFaceAPI(message, 'general');
}

/**
 * Get quick suggestions based on user input
 * @param {string} topic - The topic to get suggestions for
 * @returns {Promise<string>} - Suggestions
 */
export async function getQuickSuggestions(topic) {
  const message = `Provide 3-4 quick suggestions about: ${topic}
Keep it brief and actionable.`;
  
  return callHuggingFaceAPI(message, 'general');
}
