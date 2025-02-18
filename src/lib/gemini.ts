import { FavoriteAnime } from "@/types/anime";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY não está definida nas variáveis de ambiente');
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

function sanitizeTitle(title: string | null): string | null {
  if (!title) return null;
  
  // Remove aspas extras e espaços
  title = title.trim().replace(/^["']|["']$/g, '');
  
  // Se ficou vazio após a limpeza, retorna null
  if (!title) return null;
  
  // Remove caracteres especiais indesejados
  title = title.replace(/[^\w\s\-:]/g, '');
  
  // Remove espaços extras
  title = title.replace(/\s+/g, ' ');
  
  return title;
}

  export async function getAnimeRecommendations(animeName: string, exotic: boolean = false, userList: FavoriteAnime[] = []) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const excludeList = userList 
    ? `\nPor favor, É muito importante que você NÃO recomende nenhum dos seguintes animes que o usuário já conhece, mesmo que sejam similares ou prequels, filmes:
      ${userList.map(anime => `- ${anime.title}`).join('\n')}`
    : '';

  const prompt = `Você é um especialista em animes.
    PRIMEIRA TAREFA - Correção do título:
    Analise o título fornecido: "${animeName}"

    Se este título tiver QUALQUER erro (mesmo pequeno) ou variação do nome oficial, você DEVE fornecer a correção.
    Por exemplo:
    - "Narito" -> youMean: "Naruto"
    - "atack on titan" -> youMean: "Attack on Titan"
    - "death noto" -> youMean: "Death Note"
    - "Full Metal Alchemist" -> youMean: "Fullmetal Alchemist"
    - "Kimetsu" -> youMean: "Kimetsu no Yaiba"
    - "SAO" -> youMean: "Sword Art Online"
    - "DBZ" -> youMean: "Dragon Ball Z"

    IMPORTANTE: Se o título estiver com qualquer erro de digitação, capitalização incorreta, abreviação ou incompleto, você DEVE corrigi-lo no campo youMean.
    Se o título estiver 100% correto, use null.

    SEGUNDA TAREFA - Recomendações:
    ${exotic ? 
      `Forneça 10 recomendações mais EXÓTICAS e MENOS CONHECIDAS que sejam similares ao anime.
      Evite animes populares e mainstream.
      Foque em obras únicas, cult, antigas ou menos conhecidas que ainda mantenham elementos similares.
      ${excludeList}` 
      : 
      `Forneça 10 recomendações similares ao anime, evite animes mainstream, a não ser que realmente seja muito parecido.
      Inclua uma mistura de títulos populares e bem avaliados.
      ${excludeList}`
    }

    Responda APENAS com este JSON:
    {
      "youMean": "Título corrigido ou null se estiver perfeito",
      "recommendations": [
        {
          "title": "Nome do Anime",
          "reason": "Motivo da recomendação",
          "genres": ["genero1", "genero2"]
        }
      ]
    }
      
    caso não tenha a quantidade de recomendacoes, forneça o maximo possivel, sem repetir os animes já recomendados.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Resposta do Gemini:', text);

    // Limpa o texto antes de procurar o JSON
    const cleanedText = text
      .replace(/```json/g, '') // Remove marcadores de código JSON
      .replace(/```/g, '')     // Remove outros marcadores de código
      .trim();                 // Remove espaços extras

    // Procura pelo JSON usando uma regex mais flexível
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : null;

    if (!jsonString) {
      throw new Error('Nenhum JSON válido encontrado na resposta');
    }

    try {
      // Tenta fazer o parse do JSON após limpar caracteres potencialmente problemáticos
      const sanitizedJsonString = jsonString
        .replace(/[\u0000-\u001F]+/g, '') // Remove caracteres de controle
        .replace(/\n\s*\n/g, '\n')        // Remove linhas em branco extras
        .replace(/\s+/g, ' ');            // Normaliza espaços

      const parsed = JSON.parse(sanitizedJsonString);
      
      if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
        throw new Error('Estrutura JSON inválida');
      }

      // Sanitiza o youMean antes de retornar
      const sanitizedYouMean = sanitizeTitle(parsed.youMean);

      // Se o título sanitizado for igual ao original, retorna null
      const finalYouMean = sanitizedYouMean === animeName ? null : sanitizedYouMean;

      return {
        youMean: finalYouMean,
        recommendations: parsed.recommendations.map(rec => ({
          ...rec,
          title: sanitizeTitle(rec.title) || rec.title // Sanitiza também os títulos das recomendações
        }))
      };
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      throw new Error('Falha ao processar resposta da IA');
    }
  } catch (error) {
    console.error('Erro completo:', error);
    // Fallback com 10 recomendações genéricas
    return {
      youMean: null,
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

export async function getTasteBasedRecommendations(userTaste: string, exotic: boolean = false) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Como um especialista em anime, analise o seguinte perfil de gosto:

"${userTaste}"

IMPORTANTE: NÃO recomende nenhum dos animes já mencionados no perfil acima.

${exotic ? 
  `Recomende 10 animes MENOS CONHECIDOS e MAIS EXÓTICOS que combinem com este perfil.
   Evite:
   1. Animes já mencionados no perfil
   2. Animes populares e mainstream
   3. Continuações ou prequels dos animes citados
   
   Foque em obras únicas, cult, antigas ou menos conhecidas que ainda se encaixem no perfil.` 
  : 
  `Recomende 10 animes DIFERENTES que melhor combinem com este perfil.
   Evite:
   1. Animes já mencionados no perfil
   2. Continuações ou prequels dos animes citados
   3. Animes do mesmo universo/franquia
   
   Inclua uma mistura equilibrada de títulos que atendam às preferências descritas.`
}

Para cada recomendação:
1. Verifique se não está na lista de animes mencionados
2. Explique como se relaciona com o perfil do usuário
3. Destaque elementos diferentes dos já vistos
4. Mantenha o estilo/tema que o usuário aprecia

Responda APENAS com este JSON:
{
  "recommendations": [
    {
      "title": "Nome do Anime",
      "reason": "Explicação específica de como este anime combina com o perfil, destacando elementos novos e diferentes",
      "genres": ["genero1", "genero2"]
    }
  ]
}

As recomendações devem ser personalizadas para o perfil fornecido, mas trazendo experiências novas e diferentes.
Cada razão deve explicar como o anime atende às preferências mas oferece algo novo.`;

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

      return {
        youMean: null, // Não precisamos de correção neste caso
        recommendations: parsed.recommendations
      };
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      throw new Error('Falha ao processar resposta da IA');
    }
  } catch (error) {
    console.error('Erro completo:', error);
    return {
      youMean: null,
      recommendations: [
        // ... fallback recommendations ...
      ]
    };
  }
} 