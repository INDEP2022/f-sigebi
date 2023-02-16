export interface IExpedient {
  idExpedient?: number;
  id?: number | string;
  identifies: string;
  noCourt: string;
  preliminaryInquiry: string;
  criminalCase: string;
  // TODO: revisar el nombre correcto cuando llegue del ms
  transferId?: number;
}
