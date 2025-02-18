"use client";
import Image from "next/image";
import { useFavorites } from "@/hooks/useFavorites";
import { StreamingLinks } from "@/components/StreamingLinks";

export default function Favoritos() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Minha Lista</h1>
        <div className="space-y-2">
          <p className="text-base text-gray-200">
            {favorites.length}{" "}
            {favorites.length === 1 ? "anime salvo" : "animes salvos"}
          </p>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Aqui você pode ver a lista de animes recomendados. Depois de
            assistir, você pode remover e manter sua lista sempre organizada.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {favorites.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            Sua lista de animes está vazia
          </div>
        ) : (
          favorites.map((fav, index) => (
            <div key={index} className="glass-effect p-3 rounded-lg flex gap-4">
              {fav.coverImage && (
                <div className="flex-shrink-0 w-[60px]">
                  <div className="relative w-[60px] h-[90px]">
                    <Image
                      src={fav.coverImage}
                      alt={fav.title}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex-grow min-w-0 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-purple-300 pr-2">
                      {fav.title}
                    </h3>
                    {fav.score && (
                      <span className="flex-shrink-0 bg-purple-500/20 px-2 py-0.5 rounded-full text-xs whitespace-nowrap">
                        ⭐ {(fav.score / 10).toFixed(1)}
                      </span>
                    )}
                  </div>

                  {fav.reason && (
                    <p className="text-gray-300 text-sm line-clamp-1">
                      {fav.reason}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div className="overflow-x-auto pb-1 -mx-1 px-1">
                    <div className="flex gap-1 min-w-min">
                      {fav.genres.map((genre, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-200 whitespace-nowrap"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {fav.streamingLinks && fav.streamingLinks.length > 0 && (
                      <div className="flex gap-1">
                        {fav.streamingLinks.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg hover:scale-110 transition-transform"
                            title={link.name}
                          >
                            {link.icon}
                          </a>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => removeFavorite(fav.title)}
                      className="flex-shrink-0 p-1.5 hover:scale-110 transition-transform 
                                 text-gray-400 hover:text-red-400 rounded-full 
                                 hover:bg-white/5"
                      title="Remover dos favoritos"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
