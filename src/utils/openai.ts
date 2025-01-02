import { useAISettingsStore } from '../store/aiSettingsStore';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const FALLBACK_RESPONSES = {
  'Marketing Assistant': [
    "I recommend focusing on local SEO and customer testimonials to improve visibility.",
    "Creating engaging social media content with before/after photos can attract more customers.",
    "Consider starting a monthly newsletter to keep customers engaged."
  ],
  'BidGPT': [
    "Based on typical market rates, I'd estimate this job at $150-200 per hour plus materials.",
    "For accurate quotes, consider breaking down labor costs and material expenses separately.",
    "Remember to factor in complexity and potential complications when pricing."
  ],
  'Quick Reply': [
    "Thank you for your inquiry. We'll be happy to help with your project.",
    "We typically respond within 24 hours with a detailed quote.",
    "We appreciate your business and strive to provide excellent service."
  ]
};

export async function sendChatMessage(messages: Message[]) {
  const { apiKey } = useAISettingsStore.getState();
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.6,
        frequency_penalty: 0.5
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error Details:', errorData);
      
      switch (errorData.error?.code) {
        case 'insufficient_quota':
          return getFallbackResponse(messages, 'API quota exceeded. Using offline mode.');
        case 'invalid_api_key':
          return getFallbackResponse(messages, 'Invalid API key. Using offline mode.');
        case 'rate_limit_exceeded':
          return getFallbackResponse(messages, 'Rate limit exceeded. Using offline mode.');
        default:
          return getFallbackResponse(messages, 'API error. Using offline mode.');
      }
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return getFallbackResponse(messages, 'Connection error. Using offline mode.');
  }
}

function getFallbackResponse(messages: Message[], errorPrefix: string) {
  const systemMessage = messages.find(m => m.role === 'system')?.content || '';
  const agentType = Object.keys(FALLBACK_RESPONSES).find(type => 
    systemMessage.includes(type)
  ) || 'Quick Reply';
  
  const fallbackResponses = FALLBACK_RESPONSES[agentType as keyof typeof FALLBACK_RESPONSES];
  const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  
  return `[${errorPrefix}]\n\n${randomResponse}`;
}

export function getAgentPrompt(agentName: string) {
  const prompts: Record<string, string> = {
    'Marketing Assistant': `You are a marketing expert for a handyman business. Help create compelling content and marketing strategies.
    Focus on local SEO, social media presence, and customer testimonials.
    Provide specific, actionable advice that can be implemented immediately.
    Base your suggestions on proven marketing techniques for local service businesses.`,
    
    'BidGPT': `You are an expert estimator for a handyman business. Help create accurate and competitive job quotes.
    Consider material costs, labor hours, complexity, and market rates.
    Break down estimates into detailed line items and explain your reasoning.
    Account for local market conditions and seasonal factors in your estimates.`,
    
    'Quick Reply': `You are a professional communication assistant for a handyman business.
    Help draft clear, friendly, and professional responses to customer inquiries.
    Maintain a helpful tone while being direct and informative.
    Focus on building trust and setting clear expectations.
    Include relevant details about our services and expertise when appropriate.`
  };

  return prompts[agentName] || 'You are an AI assistant for a handyman business. Provide helpful, professional responses.';
}