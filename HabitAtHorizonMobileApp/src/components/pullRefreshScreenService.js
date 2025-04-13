import { useState } from 'react';

export const useRefreshService = (fetchFunction) => {
    // Tracks the refreshing state for UI components like pull-to-refresh
    const [refreshing, setRefreshing] = useState(false);

    // Handles the refresh logic by calling the provided fetch function and updating the state
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchFunction();
        } catch (error) {
            console.error('Error during refresh:', error);
        } finally {
            setRefreshing(false);
        }
    };

    return { refreshing, onRefresh };
};