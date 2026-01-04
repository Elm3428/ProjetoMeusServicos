
import React, { useState } from 'react';
import { Database, Copy, Check, Terminal, ShieldCheck, Save } from 'lucide-react';
import { neonDB, NEON_SQL_SCHEMA } from '../services/neonService';
import { DatabaseConfig } from '../types';

const DatabaseSettings: React.FC = () => {
  const [config, setConfig] = useState<DatabaseConfig>(neonDB.getConfig());
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(NEON_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    neonDB.saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-slate-900 p-2 rounded-lg text-white">
            <Database size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Configurações de CRUD (Neon)</h3>
            <p className="text-sm text-slate-500">Gerencie a conexão e persistência de dados</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Project ID (Neon)</label>
            <input 
              type="text" 
              value={config.projectId}
              onChange={(e) => setConfig({...config, projectId: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Nome da Tabela</label>
            <input 
              type="text" 
              value={config.tableName}
              onChange={(e) => setConfig({...config, tableName: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
            saved ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {saved ? <Check size={18} /> : <Save size={18} />}
          {saved ? 'Configurações Salvas!' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
        <div className="px-6 py-4 bg-slate-800/50 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-slate-300">
            <Terminal size={18} className="text-emerald-400" />
            <span className="text-sm font-mono font-bold tracking-tight">SQL Schema Setup</span>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? 'Copiado!' : 'Copiar Schema'}
          </button>
        </div>
        <div className="p-6">
          <pre className="text-xs font-mono text-emerald-400/90 leading-relaxed overflow-x-auto">
            {NEON_SQL_SCHEMA}
          </pre>
          <div className="mt-6 flex items-start gap-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <ShieldCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-100/80 leading-relaxed">
              <strong className="text-emerald-400 block mb-1">Dica de Segurança</strong>
              Para utilizar o CRUD real, execute o código acima no console SQL do seu projeto Neon. 
              Isso criará a estrutura necessária para armazenar seus serviços e pagamentos.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSettings;
