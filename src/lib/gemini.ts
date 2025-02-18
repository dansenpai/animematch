import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY não está definida nas variáveis de ambiente');
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function getAnimeRecommendations(animeName: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Atue como um especialista em anime e recomende 10 animes similares a "${animeName}". Seja diversificado nas recomendações, mas mantenha a relevância.

Responda APENAS com o JSON abaixo, sem nenhum texto adicional ou formatação:
{
  "recommendations": [
    {
      "title": "Nome do Primeiro Anime",
      "reason": "Motivo curto e direto da recomendação",
      "genres": ["genero1", "genero2"]
    }
  ]
}

Forneça exatamente 10 recomendações, cada uma com título único, razão específica e gêneros relevantes.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Resposta do Gemini:', text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : null;

    if (!jsonString) {
      throw new Error('Nenhum JSON válido encontrado na resposta');
    }

    try {
      const parsed = JSON.parse(jsonString);
      
      if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
        throw new Error('Estrutura JSON inválida');
      }

      // Garantir que temos exatamente 10 recomendações
      if (parsed.recommendations.length !== 10) {
        throw new Error('Número incorreto de recomendações');
      }

      return parsed;
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      throw new Error('Falha ao processar resposta da IA');
    }
  } catch (error) {
    console.error('Erro completo:', error);
    // Fallback com 10 recomendações genéricas
    return {
      recommendations: [
        {
          title: "Death Note",
          reason: "Thriller psicológico intenso com elementos sobrenaturais",
          genres: ["Thriller", "Supernatural", "Psychological"]
        },
        {
          title: "Code Geass",
          reason: "Drama estratégico com elementos de poder sobrenatural",
          genres: ["Mecha", "Drama", "Psychological"]
        },
        {
          title: "Monster",
          reason: "Thriller psicológico maduro com narrativa complexa",
          genres: ["Thriller", "Drama", "Mystery"]
        },
        {
          title: "Steins;Gate",
          reason: "Thriller psicológico com elementos de ficção científica",
          genres: ["Sci-Fi", "Thriller", "Drama"]
        },
        {
          title: "Psycho-Pass",
          reason: "Ficção científica distópica com elementos de investigação",
          genres: ["Sci-Fi", "Action", "Psychological"]
        },
        {
          title: "The Promised Neverland",
          reason: "Suspense psicológico com elementos de mistério",
          genres: ["Mystery", "Horror", "Psychological"]
        },
        {
          title: "Erased",
          reason: "Mistério sobrenatural com elementos de viagem no tempo",
          genres: ["Mystery", "Supernatural", "Drama"]
        },
        {
          title: "Terror in Resonance",
          reason: "Thriller psicológico com foco em terrorismo e conspiração",
          genres: ["Thriller", "Psychological", "Mystery"]
        },
        {
          title: "Parasyte",
          reason: "Horror psicológico com elementos de ficção científica",
          genres: ["Horror", "Sci-Fi", "Psychological"]
        },
        {
          title: "Death Parade",
          reason: "Drama psicológico com elementos sobrenaturais e filosóficos",
          genres: ["Psychological", "Drama", "Mystery"]
        }
      ]
    };
  }
} 