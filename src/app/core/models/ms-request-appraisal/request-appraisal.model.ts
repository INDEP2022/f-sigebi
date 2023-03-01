export interface IRequestAppraisal {
  id?: number;
  requestDate?: string;
  sourceUser?: string;
  targetUser?: string;
  requestType?: string;
  paid?: string;
  cveCurrencyCost?: string;
  cveCurrencyAppraisal?: string;
  observations?: string;
  noAppraiser?: string;
  noExpert?: number;
  noRegister?: number;
}
