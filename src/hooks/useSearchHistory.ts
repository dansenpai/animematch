import { useState, useEffect } from 'react';
import { SearchHistoryItem } from '@/types/anime';

const MAX_HISTORY_ITEMS = 5;

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    // Migração dos dados antigos para o novo formato
    const savedHistory = localStorage.getItem('animeSearchHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setSearchHistory(parsed);
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        localStorage.removeItem('animeSearchHistory');
      }
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