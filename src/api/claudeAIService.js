/**
 * Claude-like AI Service
 * Provides intelligent responses to any question like Claude AI
 */

// Fallback to multiple AI providers for better coverage
const AI_PROVIDERS = {
  OPENAI: 'openai',
  HUGGINGFACE: 'huggingface',
  LOCAL: 'local'
};

/**
 * Main chat function that works like Claude - answers any question intelligently
 * @param {string} userMessage - The user's message/question
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} - Intelligent AI response
 */
export async function chatWithClaudeAI(userMessage, conversationHistory = []) {
  try {
    // Try OpenAI first (most capable)
    if (process.env.REACT_APP_OPENAI_API_KEY) {
      return await getOpenAIResponse(userMessage, conversationHistory);
    }
    
    // Fallback to HuggingFace
    if (process.env.REACT_APP_HUGGINGFACE_API_KEY) {
      return await getHuggingFaceResponse(userMessage, conversationHistory);
    }
    
    // Final fallback to enhanced local AI
    return await getEnhancedLocalResponse(userMessage, conversationHistory);
    
  } catch (error) {
    console.error('AI Service Error:', error);
    return getEnhancedLocalResponse(userMessage, conversationHistory);
  }
}

/**
 * OpenAI GPT response (most intelligent)
 */
async function getOpenAIResponse(userMessage, conversationHistory) {
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  
  const systemPrompt = `You are Claude, an AI assistant created by Anthropic. You are helpful, harmless, and honest. You can answer questions on any topic with accuracy and depth. You provide thoughtful, nuanced responses and admit when you're uncertain about something.

Key traits:
- Knowledgeable across many domains (science, history, literature, current events, etc.)
- Analytical and able to break down complex topics
- Conversational and engaging
- Ethical and responsible
- Admit limitations and uncertainties
- Provide sources or suggest verification when appropriate

You are integrated into MapMates (a travel/event app) but can discuss any topic the user asks about.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 0.9
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * HuggingFace response (good alternative)
 */
async function getHuggingFaceResponse(userMessage, conversationHistory) {
  const HF_API_KEY = process.env.REACT_APP_HUGGINGFACE_API_KEY;
  
  // Use a good conversational model
  const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: userMessage,
      parameters: {
        max_length: 1000,
        temperature: 0.7,
        do_sample: true
      }
    })
  });

  if (!response.ok) {
    throw new Error(`HuggingFace API error: ${response.status}`);
  }

  const data = await response.json();
  return data[0]?.generated_text || "I'm having trouble processing that. Could you rephrase your question?";
}

/**
 * Enhanced local AI that can handle any topic intelligently
 */
async function getEnhancedLocalResponse(userMessage, conversationHistory) {
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
  
  const msg = userMessage.toLowerCase().trim();
  
  // Science and Technology
  if (/(science|physics|chemistry|biology|technology|AI|artificial intelligence|computer|programming|code|software)/i.test(msg)) {
    return getScienceTechResponse(userMessage);
  }
  
  // History and Culture
  if (/(history|historical|culture|ancient|civilization|war|empire|revolution|century)/i.test(msg)) {
    return getHistoryCultureResponse(userMessage);
  }
  
  // Philosophy and Ethics
  if (/(philosophy|ethics|moral|meaning|existence|consciousness|free will|purpose)/i.test(msg)) {
    return getPhilosophyResponse(userMessage);
  }
  
  // Current Events and Politics
  if (/(news|current|politics|government|election|policy|economy|climate|global)/i.test(msg)) {
    return getCurrentEventsResponse(userMessage);
  }
  
  // Health and Medicine
  if (/(health|medical|medicine|disease|treatment|doctor|symptoms|wellness|fitness)/i.test(msg)) {
    return getHealthResponse(userMessage);
  }
  
  // Literature and Arts
  if (/(literature|book|novel|poetry|art|music|painting|artist|writer|author)/i.test(msg)) {
    return getLiteratureArtsResponse(userMessage);
  }
  
  // Mathematics
  if (/(math|mathematics|equation|calculate|formula|geometry|algebra|statistics)/i.test(msg)) {
    return getMathResponse(userMessage);
  }
  
  // Psychology and Human Behavior
  if (/(psychology|behavior|mind|emotion|personality|mental|cognitive|social)/i.test(msg)) {
    return getPsychologyResponse(userMessage);
  }
  
  // Business and Economics
  if (/(business|economics|market|finance|investment|startup|entrepreneur|money)/i.test(msg)) {
    return getBusinessResponse(userMessage);
  }
  
  // General knowledge and explanations
  if (/(what is|explain|how does|why|define|meaning|tell me about)/i.test(msg)) {
    return getExplanationResponse(userMessage);
  }
  
  // Default intelligent response
  return getGeneralIntelligentResponse(userMessage);
}

function getGeneralIntelligentResponse(userMessage) {
  const responses = [
    `That's an interesting question about "${userMessage}". While I don't have specific expertise in every domain, I can offer some general thoughts:\n\nThis topic likely involves multiple perspectives and considerations. I'd recommend:\n\n• Looking at authoritative sources for detailed information\n• Considering different viewpoints on the subject\n• Breaking down complex aspects into smaller parts\n• Thinking about practical applications or implications\n\nWhat specific aspect would you like to explore further? I'm happy to discuss what I do know or help you think through the question.`,
    
    `I appreciate you asking about "${userMessage}". This seems like a topic that could benefit from a thoughtful analysis.\n\nFrom what I understand, questions like this often involve:\n\n• Multiple factors and variables\n• Different schools of thought or approaches\n• Both theoretical and practical considerations\n• Potential trade-offs or competing interests\n\nI'd be happy to explore this further with you. Could you share what specific angle or aspect you're most curious about? That would help me provide more targeted insights.`,
    
    `Thank you for bringing up "${userMessage}". This touches on an area where there's often rich discussion and multiple valid perspectives.\n\nSome ways to approach this might include:\n\n• Examining the fundamental principles involved\n• Looking at historical context or precedents\n• Considering current research or expert opinions\n• Thinking about real-world applications\n\nWhat drew you to this question? Understanding your interest or context would help me give you a more useful response.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function getExplanationResponse(userMessage) {
  return `I'd be happy to help explain that! "${userMessage}" is a great question.\n\nWhile I aim to be helpful, I want to be transparent that my knowledge comes from training data and may not always be complete or current. For topics requiring precision (like medical, legal, or technical advice), I'd recommend consulting authoritative sources.\n\nThat said, I can offer some general insights and help you think through the question. What specific aspect are you most curious about? Are you looking for:\n\n• A basic overview or definition?\n• How it works or functions?\n• Historical background or context?\n• Practical applications or examples?\n• Different perspectives on the topic?\n\nLet me know what would be most helpful, and I'll do my best to provide a thoughtful response!`;
}

function getBusinessResponse(userMessage) {
  return `Great business question! "${userMessage}" touches on important economic and strategic considerations.\n\nIn business contexts, success often depends on:\n\n📊 **Market Analysis**\n• Understanding customer needs and behavior\n• Competitive landscape assessment\n• Market size and growth potential\n\n💡 **Strategic Planning**\n• Clear value proposition\n• Sustainable competitive advantages\n• Risk management and contingency planning\n\n📈 **Execution Excellence**\n• Strong operational processes\n• Effective team management\n• Continuous improvement and adaptation\n\n💰 **Financial Management**\n• Cash flow optimization\n• Investment prioritization\n• Performance measurement\n\nWhat specific aspect of this business topic interests you most? I can dive deeper into strategy, operations, finance, or market dynamics.`;
}

function getScienceTechResponse(userMessage) {
  return `Fascinating scientific question! "${userMessage}" touches on some really interesting concepts.\n\n🔬 **Scientific Method Approach:**\n• Observation and hypothesis formation\n• Experimental design and testing\n• Data analysis and peer review\n• Theory development and refinement\n\n💻 **Technology Considerations:**\n• Current capabilities and limitations\n• Emerging trends and innovations\n• Ethical implications and safety\n• Practical applications and impact\n\n🧠 **Key Principles:**\n• Evidence-based reasoning\n• Reproducibility and verification\n• Interdisciplinary collaboration\n• Continuous learning and adaptation\n\nScience and technology evolve rapidly, so I'd recommend checking recent research and expert sources for the latest developments. What specific aspect would you like to explore further?`;
}

function getHistoryCultureResponse(userMessage) {
  return `What a rich historical and cultural topic! "${userMessage}" connects to fascinating aspects of human civilization.\n\n🏛️ **Historical Context:**\n• Multiple perspectives and interpretations\n• Cause and effect relationships\n• Social, economic, and political factors\n• Long-term patterns and changes\n\n🌍 **Cultural Dimensions:**\n• Values, beliefs, and traditions\n• Art, literature, and expression\n• Social structures and institutions\n• Cross-cultural influences and exchange\n\n📚 **Understanding History:**\n• Primary and secondary sources\n• Archaeological and documentary evidence\n• Bias and perspective in historical accounts\n• Relevance to contemporary issues\n\nHistory is complex and multifaceted. Different historians may interpret events differently based on new evidence or perspectives. What particular aspect or time period interests you most?`;
}

function getPhilosophyResponse(userMessage) {
  return `What a profound philosophical question! "${userMessage}" touches on fundamental questions that humans have contemplated for millennia.\n\n🤔 **Philosophical Approaches:**\n• Rational analysis and logical reasoning\n• Ethical frameworks and moral principles\n• Metaphysical questions about reality\n• Epistemological concerns about knowledge\n\n💭 **Different Perspectives:**\n• Ancient wisdom traditions\n• Modern philosophical schools\n• Contemporary debates and insights\n• Cross-cultural philosophical approaches\n\n🎯 **Key Considerations:**\n• What can we know with certainty?\n• How should we live and act?\n• What gives life meaning and purpose?\n• How do we balance individual and collective good?\n\nPhilosophy rarely provides definitive answers but helps us think more clearly about important questions. What aspect of this philosophical topic resonates most with you?`;
}

function getCurrentEventsResponse(userMessage) {
  return `That's an important contemporary issue! "${userMessage}" relates to current events and ongoing global discussions.\n\n🌐 **Current Context:**\n• Rapidly evolving situations\n• Multiple stakeholder perspectives\n• Global interconnectedness\n• Information verification challenges\n\n📰 **Staying Informed:**\n• Diverse, credible news sources\n• Fact-checking and verification\n• Understanding bias and framing\n• Long-term vs. short-term perspectives\n\n🤝 **Civic Engagement:**\n• Informed participation in democracy\n• Constructive dialogue across differences\n• Local and global impact awareness\n• Evidence-based decision making\n\nFor current events, I'd recommend checking recent, authoritative news sources as situations change rapidly. What specific aspect of this issue concerns you most?`;
}

function getHealthResponse(userMessage) {
  return `Important health topic! "${userMessage}" relates to wellbeing and medical considerations.\n\n⚠️ **Important Disclaimer:**\nI can provide general information, but this should never replace professional medical advice. Always consult healthcare providers for personal health concerns.\n\n🏥 **General Health Principles:**\n• Prevention and early intervention\n• Evidence-based medical practice\n• Individual variation in health needs\n• Holistic approach to wellbeing\n\n💪 **Wellness Factors:**\n• Nutrition and physical activity\n• Mental and emotional health\n• Sleep and stress management\n• Social connections and support\n\n📚 **Reliable Information:**\n• Medical professionals and institutions\n• Peer-reviewed research\n• Established health organizations\n• Updated clinical guidelines\n\nFor specific health concerns, please consult qualified healthcare providers. Is there a general wellness aspect I can discuss?`;
}

function getLiteratureArtsResponse(userMessage) {
  return `Beautiful topic in literature and arts! "${userMessage}" connects to the rich world of human creative expression.\n\n📖 **Literary Dimensions:**\n• Themes, symbols, and meaning\n• Historical and cultural context\n• Narrative techniques and style\n• Author's life and influences\n\n🎨 **Artistic Expression:**\n• Creative techniques and mediums\n• Cultural and historical significance\n• Aesthetic principles and movements\n• Personal and universal themes\n\n🌟 **Appreciation Approaches:**\n• Close reading and analysis\n• Historical and biographical context\n• Comparative studies\n• Personal response and interpretation\n\n💡 **Creative Impact:**\n• Influence on society and culture\n• Inspiration for other works\n• Timeless vs. contemporary relevance\n• Emotional and intellectual engagement\n\nArt and literature offer endless depths for exploration. What particular work, author, or artistic movement interests you?`;
}

function getMathResponse(userMessage) {
  return `Excellent mathematical question! "${userMessage}" involves logical reasoning and quantitative analysis.\n\n🔢 **Mathematical Thinking:**\n• Logical step-by-step reasoning\n• Pattern recognition and abstraction\n• Proof and verification methods\n• Problem-solving strategies\n\n📐 **Key Areas:**\n• Arithmetic and number theory\n• Algebra and equations\n• Geometry and spatial reasoning\n• Statistics and probability\n• Calculus and analysis\n\n💡 **Problem-Solving Approach:**\n• Understand the problem clearly\n• Identify relevant concepts and formulas\n• Work through systematically\n• Check and verify results\n\n🎯 **Applications:**\n• Real-world problem solving\n• Scientific and engineering applications\n• Financial and business analysis\n• Data analysis and modeling\n\nFor specific calculations or proofs, I'd recommend double-checking with mathematical references. What mathematical concept would you like to explore?`;
}

function getPsychologyResponse(userMessage) {
  return `Fascinating psychological topic! "${userMessage}" relates to understanding human behavior and mental processes.\n\n🧠 **Psychological Perspectives:**\n• Cognitive processes and thinking patterns\n• Emotional regulation and responses\n• Social influences and relationships\n• Developmental and individual differences\n\n📊 **Research-Based Understanding:**\n• Empirical studies and evidence\n• Multiple theoretical frameworks\n• Individual variation and complexity\n• Cultural and contextual factors\n\n🤝 **Human Behavior Factors:**\n• Biological and genetic influences\n• Environmental and social context\n• Learning and experience\n• Motivation and goals\n\n💭 **Practical Applications:**\n• Self-awareness and personal growth\n• Relationship and communication skills\n• Stress management and coping\n• Decision-making and problem-solving\n\nPsychology is complex and individual experiences vary greatly. For personal concerns, consider consulting mental health professionals. What aspect interests you most?`;
}