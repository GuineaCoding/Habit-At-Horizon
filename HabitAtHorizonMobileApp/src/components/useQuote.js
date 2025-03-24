import { useState, useCallback, useEffect } from 'react';
import { fetchRandomQuote } from './quoteService';

export const useQuote = (autoFetch = true) => {
  const [quote, setQuote] = useState({ content: '', author: '' });
  const [isLoading, setIsLoading] = useState(autoFetch);
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
    return result;
  }, []);

  useEffect(() => {
    if (autoFetch) fetchQuote();
  }, [autoFetch, fetchQuote]);

  return { quote, isLoading, error, fetchQuote };
};