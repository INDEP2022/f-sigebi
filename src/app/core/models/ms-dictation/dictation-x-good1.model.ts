import { IExpedient } from '../ms-expedient/expedient';
import { IGood } from '../ms-good/good';
import { IDictation } from './dictation-model';

export interface IDictationXGood1 {
  ofDictNumber: string;
  proceedingsNumber: string;
  id: number;
  descriptionDict: string;
  amountDict: string;
  registerNumber?: string;
  typeDict: string;
  proceedings?: IExpedient;
  good?: IGood;
  dictation?: IDictation;
}
