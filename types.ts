
export enum RecordType {
  SERVICOS = 'Serviços',
  PAGAMENTOS = 'Pagamentos'
}

export interface ServiceRecord {
  id: string;
  workerName: string;
  description: string;
  type: RecordType;
  value: number;
  date: string; // ISO string
  weekDay: string;
  client: string;
  executedBy: string;
  city: string;
}

export interface AppState {
  records: ServiceRecord[];
  isAuthenticated: boolean;
}

export interface FilterState {
  search: string;
  type: RecordType | 'Todos';
  client: string;
  city: string;
  startDate: string;
  endDate: string;
}
