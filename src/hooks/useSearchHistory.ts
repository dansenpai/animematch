import { useState, useEffect } from 'react';

export interface SearchHistoryItem {
  title: string;
  timestamp: number;
}

const MAX_HISTORY_ITEMS = 5;

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('animeSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addToHistory = (title: string) => {
    const newHistory = [
      { title, timestamp: Date.now() },
      ...searchHistory.filter(item => item.title !== title)
    ].slice(0, MAX_HISTORY_ITEMS);

    setSearchHistory(newHistory);
    localStorage.setItem('animeSearchHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('animeSearchHistory');
  };

  return { searchHistory, addToHistory, clearHistory };
} 