import { useState, useEffect } from 'react';
import { FavoriteAnime, AnimeStatus } from '@/types/anime';
import { migrateFavorites } from '@/utils/migrateFavorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteAnime[]>([]);

  useEffect(() => {
    // Executa a migração antes de carregar os favoritos
    migrateFavorites();
    
    const savedFavorites = localStorage.getItem('animeFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    }
  }, []);

  const addFavorite = (anime: Omit<FavoriteAnime, 'status'>, status: AnimeStatus) => {
    const newFavorites = [...favorites];
    const existingIndex = newFavorites.findIndex(fav => fav.title === anime.title);
    
    if (existingIndex >= 0) {
      newFavorites[existingIndex] = { ...newFavorites[existingIndex], status };
    } else {
      newFavorites.push({ ...anime, status });
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('animeFavorites', JSON.stringify(newFavorites));
  };

  const removeFavorite = (animeTitle: string) => {
    const newFavorites = favorites.filter(fav => fav.title !== animeTitle);
    setFavorites(newFavorites);
    localStorage.setItem('animeFavorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (animeTitle: string) => {
    return favorites.some(fav => fav.title === animeTitle);
  };

  const updateAnimeStatus = (animeTitle: string, status: AnimeStatus) => {
    const newFavorites = favorites.map(fav => 
      fav.title === animeTitle ? { ...fav, status } : fav
    );
    setFavorites(newFavorites);
    localStorage.setItem('animeFavorites', JSON.stringify(newFavorites));
  };

  return { 
    favorites, 
    addFavorite, 
    removeFavorite, 
    isFavorite,
    updateAnimeStatus,
    watching: favorites.filter(f => f.status === 'watching'),
    completed: favorites.filter(f => f.status === 'completed')
  };
} 