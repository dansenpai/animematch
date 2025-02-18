import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY não está definida');
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(request: Request) {
  try {
    const { description } = await request.json();
    
    if (!description) {
      return NextResponse.json(
        { error: 'Descrição é obrigatória' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analise a seguinte descrição dos gostos de anime de uma pessoa e crie um perfil detalhado do seu estilo:

"${description}"

Crie uma análise profunda que identifique:
1. Preferências de gêneros
2. Elementos narrativos favoritos
3. Tipos de personagens preferidos
4. Temas recorrentes
5. Nível de complexidade preferido

Responda em um formato conciso e direto, começando com "Seu estilo de anime é:" e listando os principais pontos identificados.
Mantenha o tom pessoal e direto, como se estivesse falando com a pessoa.
Limite a resposta a 4-5 parágrafos curtos.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const tasteProfile = response.text();

    return NextResponse.json({ tasteProfile });
  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json(
      { error: 'Erro ao analisar preferências' },
      { status: 500 }
    );
  }
} 