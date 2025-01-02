const ERROR_MESSAGES = {
  insufficient_quota: 'API quota exceeded - Please check your billing details',
  invalid_api_key: 'Invalid API key - Please check your settings',
  invalid_request_error: 'Invalid request - Please try again',
  rate_limit_exceeded: 'Rate limit exceeded - Please try again in a moment'
} as const;

type ErrorCode = keyof typeof ERROR_MESSAGES;

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code as ErrorCode] || `API error: ${code}`;
}