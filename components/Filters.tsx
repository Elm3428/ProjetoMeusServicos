
import React from 'react';
import { FilterState, RecordType } from '../types';
import { Search, Filter, X } from 'lucide-react';

interface FiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  clients: string[];
  cities: string[];
  onClose?: () => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters, clients, cities, onClose }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'Todos',
      client: 'Todos',
      city: 'Todos',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <h3 className="font-bold text-slate-800">Filtros</h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Busca</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Pesquisar descrição..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tipo</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all"
          >
            <option value="Todos">Todos</option>
            <option value={RecordType.SERVICOS}>Apenas Serviços</option>
            <option value={RecordType.PAGAMENTOS}>Apenas Pagamentos</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cliente</label>
          <select
            name="client"
            value={filters.client}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all"
          >
            <option value="Todos">Todos os Clientes</option>
            {clients.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cidade</label>
          <select
            name="city"
            value={filters.city}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all"
          >
            <option value="Todos">Todas as Cidades</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Período</label>
          <div className="space-y-2">
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
          </div>
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
      >
        <Filter size={16} />
        Limpar Filtros
      </button>
    </div>
  );
};

export default Filters;
