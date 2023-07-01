import { IOpinion } from './opinion.model';

export interface IRAsuntDic {
  code: number;
  dictum: number;
  flyerType: string;
  doc: string | null;
  property: string | null;
  g_of: string | null;
  i: string | null;
  e: string | null;
  registryNumber?: number;
}

export interface IRAsuntDic1 {
  code: number;
  dictum: number;
  flyerType: string;
  doc: string | null;
  property: string | null;
  g_of: string | null;
  i: string | null;
  e: string | null;
  registryNumber?: number;
  dictumData: IOpinion;
}
