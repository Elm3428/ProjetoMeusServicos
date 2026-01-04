
import React from 'react';
import { ServiceRecord, RecordType } from '../types';
import { formatDateBR, formatCurrency } from '../utils/dataUtils';
import { Edit2, Trash2, MapPin, Calendar } from 'lucide-react';

interface RecordsTableProps {
  records: ServiceRecord[];
  onEdit: (record: ServiceRecord) => void;
  onDelete: (id: string) => void;
}

const RecordsTable: React.FC<RecordsTableProps> = ({ records, onEdit, onDelete }) => {
  if (records.length === 0) {
    return (
      <div className="bg-slate-900/50 rounded-xl p-8 text-center border border-dashed border-slate-800">
        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Nenhum registro</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Desktop Table - Dark Theme */}
      <div className="hidden lg:block bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-500 uppercase text-[8px] font-black tracking-[0.2em] border-b border-slate-800">
              <th className="px-5 py-3">Data</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Descrição</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3 text-right">Valor</th>
              <th className="px-5 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-slate-800/30 transition-colors text-[11px]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 text-slate-300 font-bold">
                    <Calendar size={12} className="text-slate-600" />
                    {formatDateBR(record.date)}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-col">
                    <span className="text-white font-bold">{record.client}</span>
                    <span className="text-[9px] text-slate-500 flex items-center gap-1 mt-0.5 uppercase">
                      <MapPin size={10} /> {record.city}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <p className="text-slate-400 max-w-[220px] truncate">{record.description}</p>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                    record.type === RecordType.SERVICOS ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {record.type}
                  </span>
                </td>
                <td className="px-5 py-3 text-right font-black text-white">
                  {formatCurrency(record.value)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onEdit(record)} className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"><Edit2 size={12} /></button>
                    <button onClick={() => onDelete(record.id)} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile - Dark Theme */}
      <div className="lg:hidden grid gap-3">
        {records.map((record) => (
          <div key={record.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-widest ${record.type === RecordType.SERVICOS ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{record.type}</span>
                <h4 className="font-bold text-white text-xs mt-2 uppercase tracking-tight">{record.client}</h4>
                <p className="text-[9px] text-slate-500 mt-1">{formatDateBR(record.date)}</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => onEdit(record)} className="p-2 text-emerald-400 bg-emerald-500/5 rounded-lg border border-emerald-500/10"><Edit2 size={14} /></button>
                <button onClick={() => onDelete(record.id)} className="p-2 text-rose-400 bg-rose-500/5 rounded-lg border border-rose-500/10"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="bg-slate-950/40 p-2.5 rounded-lg">
              <p className="text-[10px] text-slate-400 italic">"{record.description}"</p>
            </div>
            <div className="flex justify-between items-baseline pt-1">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Valor</span>
              <span className="text-sm font-black text-white">{formatCurrency(record.value)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordsTable;
