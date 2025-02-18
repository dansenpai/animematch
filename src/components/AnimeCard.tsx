import Image from "next/image";
import { StreamingLinks } from "@/components/StreamingLinks";

interface StreamingLink {
  site: string;
  url: string;
}

interface AnimeRecommendation {
  title: string;
  reason: string;
  genres: string[];
  coverImage?: string;
  score?: number;
  streamingSites?: string[];
  streamingLinks?: StreamingLink[];
}

interface AnimeCardProps {
  anime: AnimeRecommendation;
  onFavoriteToggle: (anime: AnimeRecommendation) => void;
  isFavorite: (title: string) => boolean;
}

export function AnimeCard({
  anime,
  onFavoriteToggle,
  isFavorite,
}: AnimeCardProps) {
  const handleAddToList = () => {
    if (isFavorite(anime.title)) {
      onFavoriteToggle(anime); // Remove da lista
    } else {
      onFavoriteToggle({ ...anime, status: "watching" }); // Adiciona como "assistindo"
    }
  };

  return (
    <div className="glass-effect p-4 md:p-6 rounded-lg flex flex-col sm:flex-row gap-4 md:gap-6">
      {anime.coverImage && (
        <div className="flex-shrink-0 w-full sm:w-[120px]">
          <div className="relative w-full pt-[150%] sm:pt-[0] sm:h-[180px]">
            <Image
              src={anime.coverImage}
              alt={anime.title}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg md:text-xl font-semibold text-purple-300">
            {anime.title}
          </h3>
          {anime.score && (
            <span className="flex-shrink-0 bg-purple-500/20 px-2 py-1 rounded-full text-sm">
              ⭐ {(anime.score / 10).toFixed(1)}
            </span>
          )}
        </div>

        <p className="text-gray-300 text-sm md:text-base">{anime.reason}</p>

        <div className="flex flex-wrap gap-2">
          {anime.genres.map((genre, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-200"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-2">
          <div className="flex flex-wrap gap-2">
            <StreamingLinks links={anime.streamingLinks || []} />
          </div>
          <button
            onClick={handleAddToList}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-full hover:scale-110 transition-transform"
          >
            {isFavorite(anime.title) ? (
              <span className="text-2xl">✓</span>
            ) : (
              <span className="text-2xl">+</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
