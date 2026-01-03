
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ServiceRecord, 
  RecordType, 
  FilterState 
} from './types';
import { INITIAL_RECORDS } from './constants';
import Dashboard from './components/Dashboard';
import RecordsTable from './components/RecordsTable';
import RecordForm from './components/RecordForm';
import Filters from './components/Filters';
import AIInsights from './components/AIInsights';
import { 
  Plus, 
  LogOut, 
  LayoutDashboard, 
  List, 
  Search, 
  Download, 
  Upload,
  Menu,
  Database
} from 'lucide-react';

const App: React.FC = () => {
  // State
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ user: '', pass: '' });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'records'>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ServiceRecord | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'Todos',
    client: 'Todos',
    city: 'Todos',
    startDate: '',
    endDate: ''
  });

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem('claudemir_records');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        setRecords(INITIAL_RECORDS);
      }
    } else {
      setRecords(INITIAL_RECORDS);
      localStorage.setItem('claudemir_records', JSON.stringify(INITIAL_RECORDS));
    }
    
    const auth = localStorage.getItem('claudemir_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  // Sync Data
  useEffect(() => {
    if (records.length >= 0) {
      localStorage.setItem('claudemir_records', JSON.stringify(records));
    }
  }, [records]);

  // Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.user === 'admin' && loginData.pass === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('claudemir_auth', 'true');
    } else {
      alert('Usuário ou senha incorretos. Dica: use admin/admin');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('claudemir_auth');
  };

  const saveRecord = (record: ServiceRecord) => {
    if (editingRecord) {
      setRecords(prev => prev.map(r => r.id === record.id ? record : r));
    } else {
      setRecords(prev => [record, ...prev]);
    }
    setIsFormOpen(false);
    setEditingRecord(undefined);
  };

  const deleteRecord = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(records, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `gestor_claudemir_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (Array.isArray(imported)) {
            setRecords(prev => [...imported, ...prev]);
            alert('Importação concluída com sucesso!');
          }
        } catch (e) {
          alert('Erro ao processar arquivo JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Filtered Data
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = r.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                            r.client.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType = filters.type === 'Todos' || r.type === filters.type;
      const matchesClient = filters.client === 'Todos' || r.client === filters.client;
      const matchesCity = filters.city === 'Todos' || r.city === filters.city;
      
      let matchesDate = true;
      if (filters.startDate) matchesDate = matchesDate && r.date >= new Date(filters.startDate).toISOString();
      if (filters.endDate) matchesDate = matchesDate && r.date <= new Date(filters.endDate).toISOString();
      
      return matchesSearch && matchesType && matchesClient && matchesCity && matchesDate;
    });
  }, [records, filters]);

  const uniqueClients = useMemo(() => Array.from(new Set(records.map(r => r.client))).filter(Boolean).sort(), [records]);
  const uniqueCities = useMemo(() => Array.from(new Set(records.map(r => r.city))).filter(Boolean).sort(), [records]);
  const uniqueExecutors = useMemo(() => Array.from(new Set(records.map(r => r.executedBy))).filter(Boolean).sort(), [records]);

  // Auth Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-8">
            <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
              <Database size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Gestor de Serviços</h1>
            <p className="text-slate-500">Faça login para acessar os dados</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Usuário</label>
              <input
                type="text"
                value={loginData.user}
                onChange={e => setLoginData(p => ({ ...p, user: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                placeholder="Ex: admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
              <input
                type="password"
                value={loginData.pass}
                onChange={e => setLoginData(p => ({ ...p, pass: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              Entrar
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">Credenciais padrão: admin / admin</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transition-transform lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-white/10 p-2 rounded-lg">
              <Database size={20} />
            </div>
            <h2 className="font-bold text-lg tracking-tight">Gestor Pro</h2>
          </div>

          <nav className="flex-1 space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('records')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'records' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <List size={18} />
              Registros
            </button>
          </nav>

          <div className="mt-10 p-4 rounded-2xl bg-white/5 border border-white/10">
            <Filters 
              filters={filters} 
              setFilters={setFilters} 
              clients={uniqueClients} 
              cities={uniqueCities} 
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>

          <div className="mt-auto pt-6 border-t border-white/10 space-y-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 transition-all"
            >
              <LogOut size={18} />
              Sair da conta
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {activeTab === 'dashboard' ? 'Dashboard Financeiro' : 'Controle de Serviços'}
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">Bem-vindo de volta, Claudemir</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 mr-2">
              <label className="cursor-pointer bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 text-sm font-medium">
                <Upload size={16} />
                Importar
                <input type="file" className="hidden" accept=".json" onChange={handleImport} />
              </label>
              <button 
                onClick={handleExport}
                className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 text-sm font-medium"
              >
                <Download size={16} />
                Exportar
              </button>
            </div>
            <button 
              onClick={() => {
                setEditingRecord(undefined);
                setIsFormOpen(true);
              }}
              className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 font-bold"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Novo Registro</span>
            </button>
          </div>
        </header>

        <div className="p-6 space-y-8">
          {/* AI Insights Bar */}
          <AIInsights records={filteredRecords} />

          {activeTab === 'dashboard' ? (
            <Dashboard records={filteredRecords} />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <p>Exibindo <span className="font-bold text-slate-900">{filteredRecords.length}</span> resultados</p>
                </div>
              </div>
              <RecordsTable 
                records={filteredRecords} 
                onEdit={(rec) => {
                  setEditingRecord(rec);
                  setIsFormOpen(true);
                }}
                onDelete={deleteRecord}
              />
            </div>
          )}
        </div>
      </main>

      {/* Form Modal */}
      {isFormOpen && (
        <RecordForm 
          initialData={editingRecord}
          clients={uniqueClients}
          cities={uniqueCities}
          executors={uniqueExecutors}
          onSave={saveRecord}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingRecord(undefined);
          }}
        />
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
