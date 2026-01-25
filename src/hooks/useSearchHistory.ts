import { useState, useEffect, useCallback } from 'react';

export interface HistoryItem {
    id: string;
    title: string;
    timestamp: number;
}

const STORAGE_KEY = 'tune_twin_history';
const MAX_HISTORY = 5;

/**
 * Custom hook to manage search history in local storage.
 * Handles loading, adding, and removing history items.
 *
 * @returns Object containing history state and action handlers.
 */
export function useSearchHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from storage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setHistory(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
        setIsLoaded(true);
    }, []);

    const addToHistory = useCallback((item: Omit<HistoryItem, 'timestamp'>) => {
        setHistory(prev => {
            const newEntry = { ...item, timestamp: Date.now() };
            // Remove duplicates (by ID) and keep top N
            const filtered = prev.filter(h => h.id !== newEntry.id);
            const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY);
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const removeFromHistory = useCallback((id: string) => {
        setHistory(prev => {
            const updated = prev.filter(h => h.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    return {
        history,
        isLoaded,
        addToHistory,
        removeFromHistory
    };
}
