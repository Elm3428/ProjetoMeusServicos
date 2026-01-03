
import { GoogleGenAI } from "@google/genai";
import { ServiceRecord } from "../types";

export const getAIInsights = async (records: ServiceRecord[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prepare a summary for Gemini to avoid sending too many tokens
  const summary = records.slice(0, 50).map(r => ({
    tipo: r.type,
    valor: r.value,
    desc: r.description,
    data: r.date,
    cliente: r.client
  }));

  const prompt = `Analise os seguintes registros financeiros de prestação de serviços e forneça 3 insights rápidos em português (Brasil). 
  Seja profissional e focado em tendências ou anomalias financeiras.
  Dados: ${JSON.stringify(summary)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Você é um consultor financeiro especialista em pequenos negócios de prestação de serviços.",
        temperature: 0.7,
      },
    });
    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao conectar com a IA para gerar insights.";
  }
};
