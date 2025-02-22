export const fetchRandomQuote = async () => {
  try {
    console.log('Fetching quote from API...');
    const response = await fetch('https://zenquotes.io/api/random');

    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      throw new Error(`Failed to fetch quote: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Quote fetched successfully:', data);
    return { success: true, data: { content: data[0].q, author: data[0].a } };
  } catch (error) {
    console.error('Error fetching quote:', error.message || error);
    return { success: false, error: 'Failed to load quote. Please check your network connection and try again.' };
  }
};