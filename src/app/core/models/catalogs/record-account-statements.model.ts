export interface IRecordAccountStatements {
  square?: number;
  accountNumber?: number;
  numberAccount?: number;
  branch?: string;
  accountType?: string;
  currency?: string;
  description?: number;
  balanceOf?: number;
  balanceAt?: number;
  data: any[];
  count: number;
  dateMotion: string;
  deposit: number;
  withdrawal: number;
  factasStatusCta?: {
    nombre: string;
    cve_cuenta: string;
  };
}

export interface IBanks {
  id?: number;
  name?: string;
}

export interface IFactasStatusCta {
  nombre?: string;
  cve_cuenta?: number;
}
