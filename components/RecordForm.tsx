
import React, { useState, useEffect } from 'react';
import { ServiceRecord, RecordType } from '../types';
import { getWeekDay } from '../utils/dataUtils';
import { X } from 'lucide-react';

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
      alert("Por favor, preencha a descrição, o cliente e um valor positivo.");
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-opacity">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100"
        style={{ animation: 'modalEntry 0.2s ease-out forwards' }}
      >
        <style>{`
          @keyframes modalEntry {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
        
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Editar Registro' : 'Novo Registro'}
          </h2>
          <button 
            type="button" 
            onClick={onCancel} 
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo de Registro</label>
              <div className="flex gap-2">
                {[RecordType.SERVICOS, RecordType.PAGAMENTOS].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, type: t }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                      formData.type === t 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Data</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                name="value"
                value={formData.value || ''}
                onChange={handleChange}
                placeholder="0,00"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all font-bold"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Cliente</label>
              <input
                type="text"
                name="client"
                list="clients-list"
                value={formData.client}
                onChange={handleChange}
                placeholder="Selecione ou digite um cliente..."
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                required
              />
              <datalist id="clients-list">
                {clients.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Descrição</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                placeholder="O que foi feito?"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Cidade</label>
              <input
                type="text"
                name="city"
                list="cities-list"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ex: Maringá"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              />
              <datalist id="cities-list">
                {cities.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Executado por</label>
              <input
                type="text"
                name="executedBy"
                list="executors-list"
                value={formData.executedBy}
                onChange={handleChange}
                placeholder="Ex: Evandro"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              />
              <datalist id="executors-list">
                {executors.map(e => <option key={e} value={e} />)}
              </datalist>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg text-slate-600 font-semibold border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordForm;
