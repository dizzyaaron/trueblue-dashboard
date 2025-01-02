import { useState, useCallback } from 'react';

export function useCapitalizedInput(initialValue: string = '') {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const words = e.target.value.split(' ');
    const capitalizedWords = words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    setValue(capitalizedWords.join(' '));
  }, []);

  return [value, handleChange, setValue] as const;
}