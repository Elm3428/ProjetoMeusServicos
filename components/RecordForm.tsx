
import React, { useState, useEffect } from 'react';
import { ServiceRecord, RecordType } from '../types';
import { getWeekDay } from '../utils/dataUtils';
import { X, Edit3, PlusCircle } from 'lucide-react';

interface RecordFormProps {
  initialData?: ServiceRecord;
  clients: string[];
  cities: string[];
  executors: string[];
  onSave: (record: ServiceRecord) => void;
  onCancel: () => void;
}

const RecordForm: React.FC<RecordFormProps> = ({ 
  initialData, 
  clients, 
  cities, 
  executors, 
  onSave, 
  onCancel 
}) => {
  const getDefaultDate = () => new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<Omit<ServiceRecord, 'id'>>({
    workerName: 'Claudemir',
    description: '',
    type: RecordType.SERVICOS,
    value: 0,
    date: getDefaultDate(),
    weekDay: getWeekDay(new Date()),
    client: '',
    executedBy: executors[0] || 'Evandro',
    city: cities[0] || 'Maringá'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date.split('T')[0]
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: name === 'value' ? (parseFloat(value) || 0) : value
      };
      
      if (name === 'date' && value) {
        if (value.length === 10) {
          updated.weekDay = getWeekDay(value);
        }
      }
      
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.client.trim() || formData.value <= 0) {
      alert("Por favor, preencha todos os campos obrigatórios e um valor positivo.");
      return;
    }
    
    const finalDate = new Date(formData.date + 'T12:00:00Z').toISOString();
    
    onSave({
      id: initialData?.id || `rec_${Date.now()}`,
      ...formData,
      date: finalDate
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform animate-in zoom-in duration-200"
      >
        <div className={`px-6 py-5 flex items-center justify-between border-b border-slate-100 ${initialData ? 'bg-blue-50/50' : 'bg-slate-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${initialData ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>
              {initialData ? <Edit3 size={20} /> : <PlusCircle size={20} />}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight">
                {initialData ? 'Alterar Registro' : 'Novo Registro'}
              </h2>
              {initialData && (
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Editando entrada existente</p>
              )}
            </div>
          </div>
          <button 
            type="button" 
            onClick={onCancel} 
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Categoria</label>
              <div className="flex gap-2">
                {[RecordType.SERVICOS, RecordType.PAGAMENTOS].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, type: t }))}
                    className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${
                      formData.type === t 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Data do Evento</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-slate-900 outline-none transition-all font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Valor Total (R$)</label>
              <input
                type="number"
                step="0.01"
                name="value"
                value={formData.value || ''}
                onChange={handleChange}
                placeholder="0,00"
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-slate-900 outline-none transition-all font-black text-slate-900"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Cliente / Parceiro</label>
              <input
                type="text"
                name="client"
                list="clients-list"
                value={formData.client}
                onChange={handleChange}
                placeholder="Nome do cliente..."
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-slate-900 outline-none transition-all font-semibold"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Descrição dos Serviços</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="O que foi realizado?"
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-slate-900 outline-none transition-all resize-none font-medium text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Local / Cidade</label>
              <input
                type="text"
                name="city"
                list="cities-list"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ex: Maringá"
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-slate-900 outline-none transition-all font-semibold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Responsável</label>
              <input
                type="text"
                name="executedBy"
                list="executors-list"
                value={formData.executedBy}
                onChange={handleChange}
                placeholder="Quem executou?"
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-slate-900 outline-none transition-all font-semibold text-sm"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-4 rounded-2xl text-slate-400 font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-50 transition-colors text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl text-xs text-white ${
                initialData ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-100'
              }`}
            >
              Confirmar e Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordForm;
