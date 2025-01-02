import { useAISettingsStore } from '../../store/aiSettingsStore';

export const OPENAI_CONFIG = {
  model: 'gpt-4o-mini',
  baseURL: 'https://api.openai.com/v1',
  maxTokens: 500,
  temperature: 0.7,
  presencePenalty: 0.6,
  frequencyPenalty: 0.5,
  retryAttempts: 3,
  retryDelay: 1000, // ms
};

export function getHeaders() {
  const { apiKey } = useAISettingsStore.getState();
  
  if (!apiKey) {
    throw new Error('API key not found');
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
}

export function validateApiKey(key: string): string | null {
  if (!key) return 'API key is required';
  if (!key.startsWith('sk-')) return 'Invalid API key format';
  if (key.length < 32) return 'API key is too short';
  return null;
}