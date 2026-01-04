
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
import { neonDB } from './services/neonService';
import { 
  Plus, 
  LogOut, 
  LayoutDashboard, 
  List, 
  Download, 
  Menu,
  Database,
  Loader2,
  CheckCircle2,
  Search
} from 'lucide-react';
import { parseISO } from 'date-fns';

const App: React.FC = () => {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ user: '', pass: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ServiceRecord | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'Todos',
    client: 'Todos',
    city: 'Todos',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const initApp = async () => {
      try {
        const auth = localStorage.getItem('claudemir_auth');
        if (auth === 'true') setIsAuthenticated(true);
        const remoteRecords = await neonDB.fetchRecords();
        if (remoteRecords.length > 0) {
          setRecords(remoteRecords);
        } else {
          setRecords(INITIAL_RECORDS);
          await neonDB.syncAll(INITIAL_RECORDS);
        }
      } catch (e) {
        const saved = localStorage.getItem('claudemir_records');
        setRecords(saved ? JSON.parse(saved) : INITIAL_RECORDS);
      } finally {
        setIsLoadingInitial(false);
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (records.length >= 0) {
      localStorage.setItem('claudemir_records', JSON.stringify(records));
    }
  }, [records]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.user === 'admin' && loginData.pass === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('claudemir_auth', 'true');
    } else {
      alert('Usuário ou senha incorretos.');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('claudemir_auth');
  };

  const saveRecord = async (record: ServiceRecord) => {
    const isEditing = !!editingRecord;
    if (isEditing) {
      setRecords(prev => prev.map(r => r.id === record.id ? record : r));
      showToast("Atualizado!");
    } else {
      setRecords(prev => [record, ...prev]);
      showToast("Criado!");
    }
    await neonDB.saveRecord(record);
    setIsFormOpen(false);
    setEditingRecord(undefined);
  };

  const deleteRecord = async (id: string) => {
    if (confirm('Excluir este registro?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
      await neonDB.deleteRecord(id);
      showToast("Removido!");
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(records, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `gestor_${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
  };

  // Improved filtering + SORTING by date DESCENDING (most recent first)
  const filteredRecords = useMemo(() => {
    return records
      .filter(r => {
        const matchesSearch = r.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                              r.client.toLowerCase().includes(filters.search.toLowerCase());
        const matchesType = filters.type === 'Todos' || r.type === filters.type;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const dateA = parseISO(a.date).getTime();
        const dateB = parseISO(b.date).getTime();
        return dateB - dateA; // Descending order
      });
  }, [records, filters]);

  const uniqueClients = useMemo(() => Array.from(new Set(records.map(r => r.client))).filter(Boolean).sort(), [records]);
  const uniqueCities = useMemo(() => Array.from(new Set(records.map(r => r.city))).filter(Boolean).sort(), [records]);
  const uniqueExecutors = useMemo(() => Array.from(new Set(records.map(r => r.executedBy))).filter(Boolean).sort(), [records]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-800">
          <div className="text-center mb-6">
            <div className="bg-emerald-500 w-10 h-10 rounded-xl flex items-center justify-center text-white mx-auto mb-3">
              <Database size={20} />
            </div>
            <h1 className="text-lg font-bold text-white">Gestor de Serviços</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={loginData.user}
              onChange={e => setLoginData(p => ({ ...p, user: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Usuário"
              required
            />
            <input
              type="password"
              value={loginData.pass}
              onChange={e => setLoginData(p => ({ ...p, pass: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Senha"
              required
            />
            <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-emerald-500 transition-all">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  if (isLoadingInitial) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 text-slate-200 relative">
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] animate-in fade-in slide-in-from-top-2">
          <div className={`px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 border ${
            notification.type === 'success' ? 'bg-emerald-600 border-emerald-500' : 'bg-rose-600 border-rose-500'
          } text-white`}>
            <CheckCircle2 size={14} />
            <span className="font-bold text-[11px] uppercase tracking-wider">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Sidebar - Smaller and stealthy */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-16 bg-slate-900 border-r border-slate-800 transition-transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col items-center py-6 gap-8">
          <div className="bg-emerald-500 p-2 rounded-lg text-white">
            <Database size={16} />
          </div>
          <nav className="flex-1 flex flex-col gap-4">
            <button className="p-3 rounded-xl bg-slate-800 text-emerald-500 shadow-lg" title="Dashboard">
              <LayoutDashboard size={18} />
            </button>
            <button className="p-3 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all" title="Exportar" onClick={handleExport}>
              <Download size={18} />
            </button>
          </nav>
          <button onClick={handleLogout} className="p-3 rounded-xl text-slate-600 hover:text-rose-400" title="Sair">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-1.5 text-slate-400"><Menu size={18} /></button>
            <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text"
                placeholder="BUSCAR REGISTRO..."
                value={filters.search}
                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-[10px] font-bold tracking-widest text-white outline-none focus:ring-1 focus:ring-emerald-500 w-48 lg:w-64 transition-all"
              />
            </div>
          </div>
          <button onClick={() => { setEditingRecord(undefined); setIsFormOpen(true); }} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 hover:bg-emerald-500 shadow-lg shadow-emerald-950/20 text-[10px] font-black uppercase tracking-[0.1em]">
            <Plus size={14} /> Novo Serviço
          </button>
        </header>

        <div className="p-6 space-y-8 max-w-7xl mx-auto">
          {/* Dashboard is ALWAYS visible at the top */}
          <section id="dashboard-section">
            <Dashboard records={records} />
          </section>

          {/* Records Table follows below */}
          <section id="records-section" className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Listagem de Atividades (Mais Recentes Primeiro)</h2>
              <div className="flex gap-2">
                 <select 
                    value={filters.type} 
                    onChange={(e) => setFilters(f => ({ ...f, type: e.target.value as any }))}
                    className="bg-slate-900 border border-slate-800 rounded-md px-2 py-1 text-[9px] font-bold uppercase text-slate-400 outline-none"
                 >
                    <option value="Todos">Todos Tipos</option>
                    <option value={RecordType.SERVICOS}>Serviços</option>
                    <option value={RecordType.PAGAMENTOS}>Pagamentos</option>
                 </select>
              </div>
            </div>
            <RecordsTable 
              records={filteredRecords} 
              onEdit={(rec) => { setEditingRecord(rec); setIsFormOpen(true); }} 
              onDelete={deleteRecord} 
            />
          </section>
        </div>
      </main>

      {isFormOpen && (
        <RecordForm 
          initialData={editingRecord}
          clients={uniqueClients}
          cities={uniqueCities}
          executors={uniqueExecutors}
          onSave={saveRecord}
          onCancel={() => { setIsFormOpen(false); setEditingRecord(undefined); }}
        />
      )}
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default App;
