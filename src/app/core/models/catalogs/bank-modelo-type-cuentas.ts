export interface ItipoCuentas {
  dateMotion?: string | null; //dateMotion
  deposit?: number | null; //Deposit
  withdrawal?: number | null; //withdrawal
}

export interface ICuentaInsert {
  withdrawal: number | null;
  numberMotion?: number | null;
  deposit: number | null;
  dateMotion: string | null;
  userinsert: string | null;
  dateInsertion: string | null;
  numberAccount: number | null;
  accountNumber: {
    accountNumber: string | null;
    cveCurrency: string | null;
    cveBank: string | null;
    registerNumber: string | null;
    cveAccount: string | null;
  };
}

export interface ICuentaDelete {
  numberAccount: number;
  numberMotion: number;
}
