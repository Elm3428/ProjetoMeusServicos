
import React from 'react';
import { ServiceRecord, RecordType } from '../types';
import { formatDateBR, formatCurrency } from '../utils/dataUtils';
import { Edit2, Trash2, MapPin, User, Calendar } from 'lucide-react';

interface RecordsTableProps {
  records: ServiceRecord[];
  onEdit: (record: ServiceRecord) => void;
  onDelete: (id: string) => void;
}

const RecordsTable: React.FC<RecordsTableProps> = ({ records, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider">
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Cliente / Cidade</th>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4 text-right">Valor</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  Nenhum registro encontrado com os filtros atuais.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-medium flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        {formatDateBR(record.date)}
                      </span>
                      <span className="text-xs text-slate-400 ml-5 capitalize">{record.weekDay}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-medium flex items-center gap-1.5">
                        <User size={14} className="text-slate-400" />
                        {record.client}
                      </span>
                      <span className="text-xs text-slate-400 ml-5 flex items-center gap-1">
                        <MapPin size={10} />
                        {record.city}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-600 text-sm max-w-xs truncate" title={record.description}>
                      {record.description}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      record.type === RecordType.SERVICOS 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {record.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    {formatCurrency(record.value)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => onEdit(record)}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                        aria-label="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(record.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        aria-label="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecordsTable;
