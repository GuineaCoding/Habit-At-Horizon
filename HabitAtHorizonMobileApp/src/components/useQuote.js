import { useState, useCallback } from 'react';
import { fetchRandomQuote } from './quoteService';

export const useQuote = () => {
  const [quote, setQuote] = useState({ content: '', author: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuote = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await fetchRandomQuote();
    if (result.success) {
      setQuote(result.data);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  }, []);

  return { quote, isLoading, error, fetchQuote };
};