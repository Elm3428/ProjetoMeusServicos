
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { ServiceRecord, RecordType } from '../types';
import { formatCurrency } from '../utils/dataUtils';
import { TrendingUp, TrendingDown, DollarSign, Briefcase } from 'lucide-react';

interface DashboardProps {
  records: ServiceRecord[];
}

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  const stats = useMemo(() => {
    const totalServicos = records
      .filter(r => r.type === RecordType.SERVICOS)
      .reduce((acc, curr) => acc + curr.value, 0);
    const totalPagamentos = records
      .filter(r => r.type === RecordType.PAGAMENTOS)
      .reduce((acc, curr) => acc + curr.value, 0);
    const countServicos = records.filter(r => r.type === RecordType.SERVICOS).length;
    
    return {
      totalServicos,
      totalPagamentos,
      balance: totalServicos - totalPagamentos,
      countServicos
    };
  }, [records]);

  const clientData = useMemo(() => {
    const map = new Map<string, number>();
    records.filter(r => r.type === RecordType.SERVICOS).forEach(r => {
      map.set(r.client, (map.get(r.client) || 0) + r.value);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [records]);

  const monthlyTrends = useMemo(() => {
    const map = new Map<string, { servicos: number; pagamentos: number }>();
    records.forEach(r => {
      const monthYear = r.date.substring(0, 7); // YYYY-MM
      const current = map.get(monthYear) || { servicos: 0, pagamentos: 0 };
      if (r.type === RecordType.SERVICOS) current.servicos += r.value;
      else current.pagamentos += r.value;
      map.set(monthYear, current);
    });
    return Array.from(map.entries())
      .map(([name, val]) => ({ name, ...val }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [records]);

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Serviços</p>
            <p className="text-xl font-bold text-slate-900">{formatCurrency(stats.totalServicos)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-rose-100 p-3 rounded-lg text-rose-600">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Pagamentos</p>
            <p className="text-xl font-bold text-slate-900">{formatCurrency(stats.totalPagamentos)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Saldo Líquido</p>
            <p className={`text-xl font-bold ${stats.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatCurrency(stats.balance)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-lg text-amber-600">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Registros</p>
            <p className="text-xl font-bold text-slate-900">{records.length}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Tendência Mensal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(val: number) => formatCurrency(val)} />
                <Legend />
                <Bar name="Serviços" dataKey="servicos" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar name="Pagamentos" dataKey="pagamentos" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Top 5 Clientes (Faturamento)</h3>
          <div className="h-64 flex flex-col md:flex-row items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clientData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {clientData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => formatCurrency(val)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full md:w-48 space-y-2 mt-4 md:mt-0">
              {clientData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="text-xs text-slate-600 truncate flex-1">{item.name}</span>
                  <span className="text-xs font-bold text-slate-800">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
