import { getAnimeRecommendations, getTasteBasedRecommendations } from '@/lib/gemini';
import { getAnimeDetails, getStreamingInfo } from '@/lib/anilist';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { animeName, userTaste, exotic } = await request.json();
    
    if (!animeName && !userTaste) {
      return NextResponse.json(
        { error: 'Nome do anime ou perfil de gosto é obrigatório' },
        { status: 400 }
      );
    }

    let geminiResponse;
    if (userTaste) {
      geminiResponse = await getTasteBasedRecommendations(userTaste, exotic);
    } else {
      geminiResponse = await getAnimeRecommendations(animeName, exotic);
    }
    
    // Buscar detalhes adicionais para cada recomendação
    const enrichedRecommendations = await Promise.all(
      geminiResponse.recommendations.map(async (rec) => {
        const details = await getAnimeDetails(rec.title);
        return {
          ...rec,
          coverImage: details?.coverImage?.large,
          score: details?.averageScore,
          streamingLinks: getStreamingInfo(details)
        };
      })
    );

    return NextResponse.json({ 
      recommendations: enrichedRecommendations,
      youMean: geminiResponse.youMean
    });
  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}
