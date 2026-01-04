
import { ServiceRecord, DatabaseConfig } from "../types";

// Prioriza o ID do projeto vindo do ambiente, mantendo o fallback para o original
export const NEON_PROJECT_ID = (typeof process !== 'undefined' && process.env.NEON_PROJECT_ID) 
  ? process.env.NEON_PROJECT_ID 
  : 'org-snowy-hall-43489951';

export const DEFAULT_CONFIG: DatabaseConfig = {
  projectId: NEON_PROJECT_ID,
  apiKey: '', 
  tableName: 'claudemir_records',
  isInitialized: true
};

export const NEON_SQL_SCHEMA = `
CREATE TABLE IF NOT EXISTS claudemir_records (
    id TEXT PRIMARY KEY,
    worker_name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    value DECIMAL(12, 2) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    week_day TEXT,
    client TEXT,
    executed_by TEXT,
    city TEXT
);

CREATE INDEX IF NOT EXISTS idx_records_date ON claudemir_records(date);
CREATE INDEX IF NOT EXISTS idx_records_client ON claudemir_records(client);
`;

export const neonDB = {
  getConfig(): DatabaseConfig {
    const saved = localStorage.getItem('neon_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  },

  saveConfig(config: DatabaseConfig) {
    localStorage.setItem('neon_config', JSON.stringify(config));
  },

  async fetchRecords(): Promise<ServiceRecord[]> {
    const config = this.getConfig();
    console.log(`[Neon DB] Fetching from project: ${config.projectId}`);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    const remoteData = localStorage.getItem('neon_db_sim_data');
    return remoteData ? JSON.parse(remoteData) : [];
  },

  async saveRecord(record: ServiceRecord): Promise<void> {
    const current = await this.fetchRecords();
    const exists = current.findIndex(r => r.id === record.id);
    
    let updated;
    if (exists > -1) {
      updated = current.map(r => r.id === record.id ? record : r);
    } else {
      updated = [record, ...current];
    }
    
    localStorage.setItem('neon_db_sim_data', JSON.stringify(updated));
  },

  async deleteRecord(id: string): Promise<void> {
    const current = await this.fetchRecords();
    const updated = current.filter(r => r.id !== id);
    localStorage.setItem('neon_db_sim_data', JSON.stringify(updated));
  },

  async syncAll(records: ServiceRecord[]): Promise<void> {
    localStorage.setItem('neon_db_sim_data', JSON.stringify(records));
  }
};
