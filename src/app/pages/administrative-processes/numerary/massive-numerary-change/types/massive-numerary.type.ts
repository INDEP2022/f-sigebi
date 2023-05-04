export interface IMassiveNumeraryChangeSpent {
  noGood: number;
  npNUm: number;
  description: string;
  cveEvent: string;
  status: string;
  entry: number;
  costs: number;
  tax: number;
  impNumerary: number;
  noExpAssociated: string;
  noExpedient: string;
  quantity: number;
  noDelegation: string;
  noSubDelegation: string;
  identifier: string;
  noFlier: string;
  indNume: number;
  color?: 'red' | 'green' | 'cyan' | 'orange' | 'yellow';
}

export interface IMassiveNumeraryTableSmall {
  noGood: number;
  cveie: number;
  amount: number;
  description?: string;
  status?: string;
  type?: string;
}
