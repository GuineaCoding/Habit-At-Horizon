let currentFetch = null;

export const fetchRandomQuote = async () => {
  if (currentFetch) {
    return currentFetch;
  }

  try {
    console.log('Fetching quote from API...');
    currentFetch = fetch('https://zenquotes.io/api/random')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        console.log('Quote fetched successfully:', data);
        return {
          success: true,
          data: { content: data[0].q, author: data[0].a }
        };
      })
      .finally(() => {
        currentFetch = null;
      });

    return await currentFetch;
  } catch (error) {
    console.error('Error fetching quote:', error.message);
    return {
      success: false,
      error: 'Failed to load quote. Please try again later.'
    };
  }
};