import { useCustomerStore } from '../store/customerStore';

export function parseNotes(notesString: string | null | undefined) {
  if (!notesString) return [];
  
  try {
    const parsed = JSON.parse(notesString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse notes:', e);
    return [];
  }
}

export function formatNote(content: string, importance: 'low' | 'medium' | 'high') {
  return {
    id: Date.now().toString(),
    content: content.trim(),
    timestamp: new Date().toISOString(),
    importance
  };
}

export function syncNotesToClient(clientId: string, newNote: string, importance: 'low' | 'medium' | 'high') {
  const { customers, updateCustomer } = useCustomerStore.getState();
  const customer = customers.find(c => c.id === clientId);
  
  if (!customer) return null;

  const existingNotes = parseNotes(customer.notes);
  const noteObj = formatNote(newNote, importance);
  const updatedNotes = [...existingNotes, noteObj];

  updateCustomer(clientId, {
    notes: JSON.stringify(updatedNotes)
  });

  return noteObj;
}