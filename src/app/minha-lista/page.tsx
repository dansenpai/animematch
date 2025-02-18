"use client";
import { useState } from "react";
import Image from "next/image";
import { useFavorites, AnimeStatus } from "@/hooks/useFavorites";
import { StreamingLinks } from "@/components/StreamingLinks";

type ListTab = "watching" | "completed";

export default function MinhaLista() {
  const { watching, completed, removeFavorite, updateAnimeStatus } =
    useFavorites();
  const [activeTab, setActiveTab] = useState<ListTab>("watching");

  const currentList = activeTab === "watching" ? watching : completed;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Minha Lista</h1>
        <div className="space-y-2">
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Acompanhe os animes que você está assistindo e os que já completou
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-white/10 mb-6">
        <button
          onClick={() => setActiveTab("watching")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                    ${
                      activeTab === "watching"
                        ? "text-white border-b-2 border-purple-500"
                        : "text-gray-400 hover:text-white"
                    }`}
        >
          Assistindo ({watching.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                    ${
                      activeTab === "completed"
                        ? "text-white border-b-2 border-purple-500"
                        : "text-gray-400 hover:text-white"
                    }`}
        >
          Completados ({completed.length})
        </button>
      </div>

      <div className="space-y-4">
        {currentList.length === 0 ? (
          <p className="text-center text-gray-400">
            {activeTab === "watching"
              ? "Você não está assistindo nenhum anime no momento"
              : "Você ainda não completou nenhum anime"}
          </p>
        ) : (
          currentList.map((anime) => (
            <div
              key={anime.title}
              className="glass-effect p-4 rounded-lg flex gap-4"
            >
              {anime.coverImage && (
                <div className="flex-shrink-0 w-[100px]">
                  <div className="relative w-full h-[150px]">
                    <Image
                      src={anime.coverImage}
                      alt={anime.title}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-semibold text-purple-300">
                    {anime.title}
                  </h3>
                  <StreamingLinks links={anime.streamingLinks || []} />
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => {
                      const newStatus: AnimeStatus =
                        anime.status === "watching" ? "completed" : "watching";
                      updateAnimeStatus(anime.title, newStatus);
                    }}
                    className="text-sm px-3 py-1 rounded-full bg-purple-500/20 
                             hover:bg-purple-500/30 transition-colors"
                  >
                    {anime.status === "watching"
                      ? "Marcar como completado"
                      : "Marcar como assistindo"}
                  </button>
                  <button
                    onClick={() => removeFavorite(anime.title)}
                    className="text-sm px-3 py-1 rounded-full bg-red-500/20 
                             hover:bg-red-500/30 transition-colors"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
