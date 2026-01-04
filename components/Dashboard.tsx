
import React, { useMemo, useState } from 'react';
import { ServiceRecord, RecordType } from '../types';
import { formatCurrency } from '../utils/dataUtils';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardProps {
  records: ServiceRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const stats = useMemo(() => {
    const totalServicos = records
      .filter(r => r.type === RecordType.SERVICOS)
      .reduce((acc, curr) => acc + curr.value, 0);
    const totalPagamentos = records
      .filter(r => r.type === RecordType.PAGAMENTOS)
      .reduce((acc, curr) => acc + curr.value, 0);
    return {
      totalServicos,
      totalPagamentos,
      balance: totalServicos - totalPagamentos
    };
  }, [records]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  // Função para verificar os tipos de registros em um dia específico
  const getDayActivity = (day: Date) => {
    const dayRecords = records.filter(r => isSameDay(parseISO(r.date), day));
    return {
      hasServices: dayRecords.some(r => r.type === RecordType.SERVICOS),
      hasPayments: dayRecords.some(r => r.type === RecordType.PAGAMENTOS),
    };
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900/50 backdrop-blur-sm px-4 py-3 rounded-xl border border-slate-800 flex items-center gap-3 transition-all hover:bg-slate-900/80">
          <div className="bg-emerald-500/10 w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 shrink-0">
            <TrendingUp size={14} />
          </div>
          <div>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Receitas</p>
            <p className="text-base font-black text-white leading-tight">{formatCurrency(stats.totalServicos)}</p>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm px-4 py-3 rounded-xl border border-slate-800 flex items-center gap-3 transition-all hover:bg-slate-900/80">
          <div className="bg-rose-500/10 w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 shrink-0">
            <TrendingDown size={14} />
          </div>
          <div>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Despesas</p>
            <p className="text-base font-black text-white leading-tight">{formatCurrency(stats.totalPagamentos)}</p>
          </div>
        </div>

        <div className="bg-emerald-600 px-4 py-3 rounded-xl shadow-lg shadow-emerald-950/20 flex items-center gap-3">
          <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0">
            <DollarSign size={14} />
          </div>
          <div>
            <p className="text-[8px] text-emerald-100/70 font-bold uppercase tracking-widest">Saldo Atual</p>
            <p className="text-base font-black text-white leading-tight">
              {formatCurrency(stats.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Mini Calendar Row */}
      <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon size={12} className="text-emerald-500" />
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Agenda de Serviços</h3>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Legenda simples */}
             <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-1">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                   <span className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter">Serviços</span>
                </div>
                <div className="flex items-center gap-1">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                   <span className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter">Pagamentos</span>
                </div>
             </div>

             <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-md">
               <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-slate-700 rounded text-slate-500 transition-all"><ChevronLeft size={10} /></button>
               <span className="text-[9px] font-bold text-slate-300 capitalize w-16 text-center">{format(currentMonth, 'MMM yy', { locale: ptBR })}</span>
               <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-slate-700 rounded text-slate-500 transition-all"><ChevronRight size={10} /></button>
             </div>
          </div>
        </div>

        <div className="max-w-[240px] mx-auto">
          <div className="grid grid-cols-7 mb-1">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
              <span key={day} className="text-[7px] font-black text-slate-600 text-center">{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {calendarDays.map((day, idx) => {
              const isToday = isSameDay(day, new Date());
              const isSelectedMonth = isSameMonth(day, currentMonth);
              const activity = getDayActivity(day);
              
              return (
                <div key={idx} className="aspect-square flex flex-col items-center justify-center relative">
                  <div className={`
                    w-6 h-6 flex items-center justify-center rounded-md text-[9px] font-bold transition-all
                    ${isToday ? 'bg-emerald-600 text-white shadow-md' : isSelectedMonth ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-800'}
                  `}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Indicadores de Atividade */}
                  {isSelectedMonth && !isToday && (activity.hasServices || activity.hasPayments) && (
                    <div className="absolute bottom-0.5 flex gap-0.5 items-center justify-center">
                      {activity.hasServices && (
                        <div 
                          title="Serviços"
                          className="w-1.5 h-1.5 bg-emerald-500 rounded-full border border-slate-900 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                        ></div>
                      )}
                      {activity.hasPayments && (
                        <div 
                          title="Pagamentos"
                          className="w-1.5 h-1.5 bg-blue-500 rounded-full border border-slate-900 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                        ></div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
