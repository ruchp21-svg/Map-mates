/**
 * OpenAI API Service
 * Handles all OpenAI API calls for the AI Chatbot
 */

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// System prompt for the MapMates AI Assistant
const SYSTEM_PROMPT = `You are MapMates AI Assistant, a helpful travel and event planning chatbot integrated with the MapMates app. You help users:

1. **Discover Events**: Recommend events based on their interests and location
2. **Create Events**: Help users create events through natural language conversation
3. **Answer Questions**: Provide guidance on how to use MapMates features
4. **Suggest Meetups**: Recommend trending group trips and meetups nearby

When recommending events or trips:
- Ask about user preferences (interests, budget, dates, location)
- Provide specific, actionable suggestions
- Include relevant details like timing, location, and estimated participants

When helping create events:
- Guide users step-by-step through the event creation process
- Ask clarifying questions about event details
- Summarize the event before confirming

Keep responses concise and friendly. Use a conversational tone. When relevant, suggest using MapMates features like creating a trip, viewing the map, or checking feedback from other users.`;

/**
 * Send a message to OpenAI and get a response
 * @param {Array} messages - Array of message objects with 'role' and 'content'
 * @param {string} userLocation - User's current location (optional, for context)
 * @param {string} userInterests - User's interests (optional, for context)
 * @returns {Promise<string>} - The assistant's response
 */
export async function sendMessageToOpenAI(messages, userLocation = null, userInterests = null) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Set REACT_APP_OPENAI_API_KEY in environment variables.');
  }

  try {
    // Enhance system prompt with user context if available
    let enhancedSystemPrompt = SYSTEM_PROMPT;
    if (userLocation) {
      enhancedSystemPrompt += `\n\nUser's Location: ${userLocation}`;
    }
    if (userInterests) {
      enhancedSystemPrompt += `\nUser's Interests: ${userInterests}`;
    }

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: enhancedSystemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

/**
 * Get event recommendations based on user preferences
 * @param {string} interests - User's interests
 * @param {string} location - User's location
 * @param {string} budget - User's budget
 * @returns {Promise<string>} - Recommendations from OpenAI
 */
export async function getEventRecommendations(interests, location, budget = 'moderate') {
  const prompt = `User Interests: ${interests}\nLocation: ${location}\nBudget: ${budget}\n\nBased on these preferences, please recommend 3-4 exciting events or trips that would be a good fit. For each recommendation, include the type of event, why it matches their interests, and estimated cost if applicable.`;

  try {
    return await sendMessageToOpenAI(
      [{ role: 'user', content: prompt }],
      location,
      interests
    );
  } catch (error) {
    console.error('Error getting event recommendations:', error);
    throw error;
  }
}

/**
 * Help user create an event through conversation
 * @param {string} eventDescription - Initial description from user
 * @param {Array} conversationHistory - Previous messages in conversation
 * @returns {Promise<string>} - Next question or summary from assistant
 */
export async function helpCreateEvent(eventDescription, conversationHistory = []) {
  try {
    const userMessage = {
      role: 'user',
      content: eventDescription
    };

    return await sendMessageToOpenAI([...conversationHistory, userMessage]);
  } catch (error) {
    console.error('Error in event creation help:', error);
    throw error;
  }
}

/**
 * Answer general MapMates usage questions
 * @param {string} question - User's question
 * @returns {Promise<string>} - Answer from assistant
 */
export async function answerUsageQuestion(question) {
  try {
    return await sendMessageToOpenAI(
      [{ role: 'user', content: question }]
    );
  } catch (error) {
    console.error('Error answering usage question:', error);
    throw error;
  }
}

/**
 * Get trending meetup suggestions
 * @param {string} location - User's location
 * @returns {Promise<string>} - Trending meetup suggestions
 */
export async function getTrendingMeetups(location) {
  const prompt = `What are some trending group trips and meetups happening near ${location}? Please suggest 3-4 popular activities or group trips, including estimated group size and what makes them trending.`;

  try {
    return await sendMessageToOpenAI(
      [{ role: 'user', content: prompt }],
      location
    );
  } catch (error) {
    console.error('Error getting trending meetups:', error);
    throw error;
  }
}
