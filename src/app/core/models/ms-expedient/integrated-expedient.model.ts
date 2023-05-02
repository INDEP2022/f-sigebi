import { IExpedient } from './expedient';

export interface IIntegratedExpedient {
  proceedingsIntNumber: string;
  proceedingsNumber: IExpedient;
  recordNumber?: any;
}
