import { IGood } from '../ms-good/good';

export interface IMenage {
  noGoodMenaje: string;
  noGood: IGood;
  noRegister: string;
}

export interface IMenageWrite {
  noGoodMenaje: string | number;
  noGood: string | number;
  noRegister?: string | number;
}
