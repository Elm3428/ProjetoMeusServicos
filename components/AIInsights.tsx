
import React, { useState } from 'react';
import { ServiceRecord } from '../types';
import { getAIInsights } from '../services/geminiService';
import { Sparkles, Loader2, RefreshCcw } from 'lucide-react';

interface AIInsightsProps {
  records: ServiceRecord[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ records }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const text = await getAIInsights(records);
      setInsight(text);
    } catch (e) {
      setInsight("Erro ao gerar análise.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Insights de IA</h3>
            <p className="text-xs text-slate-500">Análise inteligente dos seus serviços</p>
          </div>
        </div>
        {!loading && insight && (
          <button 
            onClick={handleGenerate}
            className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-100 transition-all"
          >
            <RefreshCcw size={18} />
          </button>
        )}
      </div>

      {!insight && !loading && (
        <div className="text-center py-4">
          <p className="text-sm text-slate-600 mb-4">
            Deseja uma análise inteligente dos registros filtrados?
          </p>
          <button
            onClick={handleGenerate}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
          >
            Gerar Análise agora
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
          <p className="text-sm text-slate-500 font-medium">O Gemini está analisando seus dados...</p>
        </div>
      )}

      {insight && !loading && (
        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-top-2 duration-500">
          {insight}
        </div>
      )}
    </div>
  );
};

export default AIInsights;
