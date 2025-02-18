import { useState, useEffect } from 'react';

export interface FavoriteAnime {
  title: string;
  coverImage?: string;
  genres: string[];
  score?: number;
  reason?: string;
  streamingLinks?: Array<{
    name: string;
    icon: string;
    url: string;
  }>;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteAnime[]>([]);

  useEffect(() => {
    // Carrega favoritos do localStorage quando o componente monta
    const savedFavorites = localStorage.getItem('animeFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const addFavorite = (anime: FavoriteAnime) => {
    const newFavorites = [...favorites];
    const exists = newFavorites.some(fav => fav.title === anime.title);
    
    if (!exists) {
      newFavorites.push(anime);
      setFavorites(newFavorites);
      localStorage.setItem('animeFavorites', JSON.stringify(newFavorites));
    }
  };

  const removeFavorite = (animeTitle: string) => {
    const newFavorites = favorites.filter(fav => fav.title !== animeTitle);
    setFavorites(newFavorites);
    localStorage.setItem('animeFavorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (animeTitle: string) => {
    return favorites.some(fav => fav.title === animeTitle);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
} 