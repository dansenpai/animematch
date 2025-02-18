import { getAnimeRecommendations } from '@/lib/gemini';
import { getAnimeDetails, getStreamingInfo } from '@/lib/anilist';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { animeName } = await request.json();
    
    if (!animeName) {
      return NextResponse.json(
        { error: 'Nome do anime é obrigatório' },
        { status: 400 }
      );
    }

    const recommendations = await getAnimeRecommendations(animeName);
    
    // Buscar detalhes adicionais para cada recomendação
    const enrichedRecommendations = await Promise.all(
      recommendations.recommendations.map(async (rec) => {
        const details = await getAnimeDetails(rec.title);
        return {
          ...rec,
          coverImage: details?.coverImage?.large,
          score: details?.averageScore,
          streamingLinks: getStreamingInfo(details)
        };
      })
    );

    return NextResponse.json({ recommendations: enrichedRecommendations });
  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}
