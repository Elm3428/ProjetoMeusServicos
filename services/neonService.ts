
import { ServiceRecord, DatabaseConfig } from "../types";

// Fixed: Exporting NEON_PROJECT_ID to resolve the import error in App.tsx
export const NEON_PROJECT_ID = 'org-snowy-hall-43489951';

export const DEFAULT_CONFIG: DatabaseConfig = {
  projectId: NEON_PROJECT_ID,
  apiKey: '', // A chave fornecida pelo usuário
  tableName: 'claudemir_records',
  isInitialized: true
};

/**
 * SQL Schema para criação da tabela no Neon Console
 */
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
  /**
   * Busca as configurações salvas ou retorna a padrão
   */
  getConfig(): DatabaseConfig {
    const saved = localStorage.getItem('neon_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  },

  /**
   * Salva novas configurações
   */
  saveConfig(config: DatabaseConfig) {
    localStorage.setItem('neon_config', JSON.stringify(config));
  },

  /**
   * Busca todos os registros (Simulado com lógica SQL-like)
   */
  async fetchRecords(): Promise<ServiceRecord[]> {
    const config = this.getConfig();
    console.log(`[Neon CRUD] SELECT * FROM ${config.tableName} WHERE project_id = '${config.projectId}'`);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    const remoteData = localStorage.getItem('neon_db_sim_data');
    return remoteData ? JSON.parse(remoteData) : [];
  },

  /**
   * Inserir ou Atualizar (UPSERT)
   */
  async saveRecord(record: ServiceRecord): Promise<void> {
    const config = this.getConfig();
    console.log(`[Neon CRUD] INSERT INTO ${config.tableName} (...) ON CONFLICT (id) DO UPDATE...`);
    
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

  /**
   * Remover registro (DELETE)
   */
  async deleteRecord(id: string): Promise<void> {
    const config = this.getConfig();
    console.log(`[Neon CRUD] DELETE FROM ${config.tableName} WHERE id = '${id}'`);
    const current = await this.fetchRecords();
    const updated = current.filter(r => r.id !== id);
    localStorage.setItem('neon_db_sim_data', JSON.stringify(updated));
  },

  /**
   * Sincronização em massa
   */
  async syncAll(records: ServiceRecord[]): Promise<void> {
    const config = this.getConfig();
    console.log(`[Neon CRUD] TRUNCATE ${config.tableName}; INSERT INTO ${config.tableName} ... (${records.length} records)`);
    localStorage.setItem('neon_db_sim_data', JSON.stringify(records));
  }
};
