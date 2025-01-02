const FALLBACK_RESPONSES = {
  'Quote Assistant': [
    "Based on typical market rates, I estimate this job would cost between $150-200 per hour plus materials.",
    "For this type of work, consider a base rate of $75/hour plus materials markup of 20%.",
    "Standard pricing for this service ranges from $500-1000 depending on complexity."
  ],
  'Schedule Optimizer': [
    "I recommend grouping jobs by location to minimize travel time.",
    "Consider scheduling intensive jobs earlier in the day when energy levels are highest.",
    "Leave buffer time between jobs for unexpected complications."
  ],
  'Customer Support': [
    "Thank you for your inquiry. We'll review your request and get back to you within 24 hours.",
    "We appreciate your business. Our team will contact you shortly to discuss details.",
    "Thank you for choosing our services. We'll schedule your appointment as soon as possible."
  ]
} as const;

export function getFallbackResponse(systemMessage: string, errorPrefix: string): string {
  // Determine which assistant type based on system message
  const assistantType = Object.keys(FALLBACK_RESPONSES).find(type => 
    systemMessage.toLowerCase().includes(type.toLowerCase())
  ) || 'Customer Support';
  
  const responses = FALLBACK_RESPONSES[assistantType as keyof typeof FALLBACK_RESPONSES];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return `[${errorPrefix}]\n\n${randomResponse}`;
}