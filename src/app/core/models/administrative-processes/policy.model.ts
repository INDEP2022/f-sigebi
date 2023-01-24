//Interface Provisional sin Validar
export interface IPolicy {
  id?: number;
  startDate: Date;
  description: string;
  endDate: Date;
  insurance: string;
  idService: number;
  type: string;
  renovation: string;
  registryNumber: number;
  antId: number;
  bonusAmount: number;
  prorBonusAmount: number;
  startDateAnt: Date;
  endDateAnt: Date;
  expenseRequestNumberE: number;
  entryRequestNumberE: number;
  taxes: number;
  exchangeType: number;
  amountSpentExp: number;
  spentRequestNumber: number;
  spentId: number;
}
