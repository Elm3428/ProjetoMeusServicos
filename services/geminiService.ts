
import { GoogleGenAI } from "@google/genai";
import { ServiceRecord } from "../types";

export const getAIInsights = async (records: ServiceRecord[]): Promise<string> => {
  // Inicializa a IA usando a variável de ambiente conforme as diretrizes
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prepara um resumo otimizado para análise
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
      model: 'gemini-3-pro-preview', // Upgrade para o modelo Pro para melhor raciocínio financeiro
      contents: prompt,
      config: {
        systemInstruction: "Você é um consultor financeiro sênior especializado em logística e manutenção industrial. Sua linguagem deve ser técnica, porém clara e direta para um dono de pequeno negócio.",
        temperature: 0.5, // Menor temperatura para respostas mais factuais
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });
    
    return response.text || "Os dados foram analisados, mas nenhum insight relevante foi gerado no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    if (error instanceof Error && error.message.includes("API_KEY")) {
      return "Erro: Chave de API não configurada corretamente no ambiente de deploy.";
    }
    return "Erro ao conectar com a inteligência artificial. Verifique sua conexão e configurações de ambiente.";
  }
};
