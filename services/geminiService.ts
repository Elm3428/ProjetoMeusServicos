
import { GoogleGenAI } from "@google/genai";
import { ServiceRecord } from "../types";

export const getAIInsights = async (records: ServiceRecord[]): Promise<string> => {
  const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
  
  if (!apiKey) {
    return "Erro: Chave de API do Gemini não configurada nas variáveis de ambiente.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const summary = records.slice(0, 60).map(r => ({
    tipo: r.type,
    valor: r.value,
    desc: r.description,
    data: r.date,
    cliente: r.client,
    cidade: r.city
  }));

  const prompt = `Analise os seguintes registros financeiros de prestação de serviços (Claudemir Serviços). 
  Forneça 3 insights estratégicos focados em:
  1. Tendência de lucratividade.
  2. Identificação de clientes ou cidades mais recorrentes.
  3. Sugestão de economia ou otimização de agenda baseada nos pagamentos vs serviços.
  
  Dados: ${JSON.stringify(summary)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "Você é um consultor financeiro sênior especializado em logística e manutenção industrial. Sua linguagem deve ser técnica, porém clara e direta para um dono de pequeno negócio.",
        temperature: 0.5,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });
    
    return response.text || "Os dados foram analisados, mas nenhum insight relevante foi gerado no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao conectar com a inteligência artificial. Verifique sua conexão e configurações de ambiente.";
  }
};
