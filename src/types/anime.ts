export type AnimeStatus = 'watching' | 'completed';

export interface AnimeBase {
  title: string;
  coverImage?: string;
  score?: number;
  genres: string[];
  reason?: string;
  streamingLinks?: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
}

export interface FavoriteAnime extends AnimeBase {
  status: AnimeStatus;
}

export interface SearchHistoryItem {
  title: string;
  timestamp: number;
}

export interface UserProfile {
  tasteProfile?: string;
  lastAnalysis?: number;
} 