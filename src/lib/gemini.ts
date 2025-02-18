import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY não está definida nas variáveis de ambiente');
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function getAnimeRecommendations(animeName: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Atue como um especialista em anime e recomende 4 animes similares a "${animeName}".

Responda APENAS com o JSON abaixo, sem nenhum texto adicional ou formatação:
{
  "recommendations": [
    {
      "title": "Nome do Primeiro Anime",
      "reason": "Motivo curto e direto da recomendação",
      "genres": ["genero1", "genero2"]
    },
    {
      "title": "Nome do Segundo Anime",
      "reason": "Motivo curto e direto da recomendação",
      "genres": ["genero1", "genero2"]
    },
    {
      "title": "Nome do Terceiro Anime",
      "reason": "Motivo curto e direto da recomendação",
      "genres": ["genero1", "genero2"]
    },
    {
      "title": "Nome do Quarto Anime",
      "reason": "Motivo curto e direto da recomendação",
      "genres": ["genero1", "genero2"]
    }
  ]
}`;

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

      return parsed;
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      throw new Error('Falha ao processar resposta da IA');
    }
  } catch (error) {
    console.error('Erro completo:', error);
    return {
      recommendations: [
        {
          title: "Death Note",
          reason: "Um thriller psicológico intenso com elementos sobrenaturais",
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
        }
      ]
    };
  }
} 