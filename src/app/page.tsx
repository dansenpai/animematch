"use client";
import Image from "next/image";
import { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { StreamingLinks } from "@/components/StreamingLinks";
import { AnimeCard } from "@/components/AnimeCard";

interface AnimeRecommendation {
  title: string;
  reason: string;
  genres: string[];
  coverImage?: string;
  score?: number;
  streamingSites?: string[];
  streamingLinks?: StreamingLink[];
}

interface RecommendationsResponse {
  recommendations: AnimeRecommendation[];
}

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AnimeRecommendation[]>(
    []
  );
  const [error, setError] = useState("");

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { searchHistory, addToHistory, clearHistory } = useSearchHistory();

  const handleSearch = async (searchTerm: string = searchInput) => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animeName: searchTerm }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setRecommendations(data.recommendations);
      addToHistory(searchTerm);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao buscar recomendações"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (anime: AnimeRecommendation) => {
    const { title, coverImage, genres, score, reason, streamingLinks } = anime;
    if (isFavorite(title)) {
      removeFavorite(title);
    } else {
      addFavorite({ title, coverImage, genres, score, reason, streamingLinks });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchInput.trim() && !isLoading) {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Descubra Novos Animes
        </h1>
        <p className="text-base md:text-lg text-gray-200">
          Encontre recomendações baseadas nos seus animes favoritos
        </p>
      </div>

      <div className="glass-effect rounded-xl p-6 md:p-8 space-y-6 w-full max-w-full mx-auto">
        <div className="space-y-2">
          <label className="text-sm text-gray-200 ml-1">
            Digite um anime que você gosta
          </label>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ex: Naruto, One Piece, Death Note..."
            className="w-full p-4 text-lg rounded-lg bg-white/10 border border-white/20 
                     focus:ring-2 focus:ring-purple-500 focus:border-transparent
                     text-white placeholder-gray-400 transition-all"
          />
        </div>

        <button
          onClick={() => handleSearch()}
          disabled={isLoading || !searchInput.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 
                   hover:from-indigo-500 hover:to-purple-500 
                   text-white font-semibold py-4 px-6 rounded-lg 
                   transition-all transform hover:scale-[1.02] active:scale-[0.98]
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Buscando..." : "Encontrar Recomendações"}
        </button>

        {searchHistory.length > 0 && (
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Buscas recentes</span>
              <button
                onClick={clearHistory}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Limpar histórico
              </button>
            </div>
            <div className="overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex gap-2 min-w-min">
                {searchHistory.map((item) => (
                  <button
                    key={item.timestamp}
                    onClick={() => {
                      setSearchInput(item.title);
                      handleSearch(item.title);
                    }}
                    className="px-3 py-1.5 text-sm rounded-lg bg-white/5 
                             hover:bg-white/10 transition-colors text-gray-200
                             flex items-center gap-2 group whitespace-nowrap"
                  >
                    <span>{item.title}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-50 group-hover:opacity-100 transition-opacity"
                    >
                      <polyline points="9 10 4 15 9 20" />
                      <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {error && <div className="text-red-400 text-center w-full">{error}</div>}

      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {recommendations.map((rec, index) => (
            <AnimeCard
              key={index}
              anime={rec}
              onFavoriteToggle={toggleFavorite}
              isFavorite={isFavorite}
            />
          ))}
        </div>
      )}

      <div className="text-center py-6">
        <p className="text-sm text-gray-400 max-w-lg mx-auto flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-purple-400"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          Adicione animes à sua lista para não perder nenhuma recomendação
        </p>
      </div>
    </div>
  );
}
