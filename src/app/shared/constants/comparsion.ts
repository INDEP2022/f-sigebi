import { IComparsion } from '../interfaces/comparsion.interface';

export const COMPARSION: Partial<IComparsion> = {
  EQUAL: {
    id: 'EQUAL',
    symbol: '=',
    name: 'Igual que',
  },
  LESS_THAN: {
    id: 'LESS_THAN',
    symbol: '<',
    name: 'Menor que',
  },
  MORE_THAN: {
    id: 'MORE_THAN',
    symbol: '>',
    name: 'Mayor que',
  },
  NOT: {
    id: 'NOT',
    symbol: '!=',
    name: 'Diferente de',
  },
  LIKE: {
    id: 'LIKE',
    symbol: '%%',
    name: 'Como',
  },
};
