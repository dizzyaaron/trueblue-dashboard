import { OPENAI_CONFIG } from './config';
import { Message } from './types';
import { getFallbackResponse } from './fallback';
import { useAISettingsStore } from '../../store/aiSettingsStore';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function sendChatMessage(messages: Message[]): Promise<string> {
  const { apiKey, isOfflineMode, setOfflineMode } = useAISettingsStore.getState();

  // Check offline mode or missing API key
  if (isOfflineMode || !apiKey) {
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    return getFallbackResponse(systemMessage, 'Running in offline mode');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: OPENAI_CONFIG.model,
        messages,
        temperature: OPENAI_CONFIG.temperature,
        max_tokens: OPENAI_CONFIG.maxTokens
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error?.code === 'insufficient_quota') {
        setOfflineMode(true);
        return getFallbackResponse(
          messages[0]?.content || '',
          'API quota exceeded. Switched to offline mode.'
        );
      }

      if (response.status === 429) {
        await delay(1000); // Wait 1 second before retry
        return sendChatMessage(messages); // Retry the request
      }

      throw new Error(data.error?.message || 'API Error');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    setOfflineMode(true);
    
    return getFallbackResponse(
      messages[0]?.content || '',
      'Connection error. Switched to offline mode.'
    );
  }
}