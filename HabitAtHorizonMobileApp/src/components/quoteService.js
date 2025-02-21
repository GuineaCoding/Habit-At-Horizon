export const fetchRandomQuote = async () => {
    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }

        const data = await response.json();
        return { success: true, data: { content: data.content, author: data.author } };
    } catch (error) {
        console.error('Error fetching quote:', error);
        return { success: false, error: 'Failed to load quote. Please try again.' };
    }
};