
import { format, addDays, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Converts Excel serial date to ISO string.
 * Excel origin is 1899-12-30.
 */
export const excelSerialToDate = (serial: number): string => {
  const date = addDays(new Date(1899, 11, 30), serial);
  return date.toISOString();
};

export const formatDateBR = (isoString: string): string => {
  try {
    const date = parseISO(isoString);
    if (!isValid(date)) return 'Data Inválida';
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch (e) {
    return 'Data Inválida';
  }
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const getWeekDay = (date: Date | string): string => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return 'Dia Indefinido';
    return format(d, 'eeee-feira', { locale: ptBR });
  } catch (e) {
    return 'Dia Indefinido';
  }
};
