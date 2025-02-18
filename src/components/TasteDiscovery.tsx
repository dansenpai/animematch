import { useState, useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";

interface Props {
  onSearch: (tasteProfile: string) => void;
  isSearching?: boolean;
}

export function TasteDiscovery({ onSearch, isSearching = false }: Props) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { userProfile, saveProfile, clearProfile } = useUserProfile();

  const analyzeTaste = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze-taste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: input }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      saveProfile({
        tasteProfile: data.tasteProfile,
        lastUpdated: Date.now(),
      });

      setInput("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao analisar preferências"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (userProfile) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-white/5 rounded-lg">
          <h3 className="text-lg font-medium text-purple-300 mb-4">
            Seu perfil de anime
          </h3>
          <p className="text-gray-200 text-sm whitespace-pre-line leading-relaxed">
            {userProfile.tasteProfile}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onSearch(userProfile.tasteProfile)}
            disabled={isSearching}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 
                     hover:from-indigo-500 hover:to-purple-500 
                     text-white font-semibold py-3 px-6 rounded-lg 
                     transition-all transform hover:scale-[1.02] active:scale-[0.98]
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {isSearching ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Buscando...
              </>
            ) : (
              <>
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
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Buscar baseado no meu gosto
              </>
            )}
          </button>

          <button
            onClick={clearProfile}
            className="sm:w-auto bg-white/5 hover:bg-white/10 
                     text-gray-300 font-medium py-3 px-6 rounded-lg 
                     transition-all flex items-center justify-center gap-2"
          >
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
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
            Refazer análise
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-gray-200">
          Para entender melhor seu gosto, conte-nos sobre:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
          <li>Quais animes você mais gostou de assistir</li>
          <li>
            O que mais te atrai em um anime (história, ação, romance, etc)
          </li>
          <li>Temas ou elementos que você procura em um anime</li>
          <li>Tipos de personagens que você mais gosta</li>
        </ul>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ex: Eu gosto muito de Steins;Gate e Death Note pela complexidade da história. Prefiro animes que fazem pensar e têm reviravoltas. Gosto de personagens inteligentes e estratégicos..."
        className="w-full h-40 p-4 text-base rounded-lg bg-white/10 border border-white/20 
                 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                 text-white placeholder-gray-400 transition-all resize-none"
      />

      <button
        onClick={analyzeTaste}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 
                 hover:from-indigo-500 hover:to-purple-500 
                 text-white font-semibold py-4 px-6 rounded-lg 
                 transition-all transform hover:scale-[1.02] active:scale-[0.98]
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Analisando..." : "Analisar Meu Gosto"}
      </button>

      {error && <div className="text-red-400 text-center">{error}</div>}
    </div>
  );
}
