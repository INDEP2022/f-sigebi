import { IProceedings } from './proceedings.model';

//interfaz usada para la actualización de un acta de devolución
export interface IUpdateProceedings
  extends Omit<IProceedings, 'fileNumber' | 'transferNumber'> {
  fileNumber: number;
  transferNumber: number;
}

export interface ICveAct {
  pExpedientNumber: string | number;
  pGoodNumber: string | number;
  pVarTypeActa1: string;
  pVarTypeActa2: string;
}
