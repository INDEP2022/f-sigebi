import { IQuestion } from './question.model';

export interface IResponse {
  id: number;
  idQuestion: IQuestion;
  text: string | null;
  startValue: number | null;
  endValue: number | null;
  //registerNumber: number | null;
}
