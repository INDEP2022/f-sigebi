export interface IComparsionOperator {
  id: string;
  symbol: string;
  name: string;
}

export interface IComparsion {
  EQUAL: IComparsionOperator;
  LESS_THAN: IComparsionOperator;
  MORE_THAN: IComparsionOperator;
  NOT: IComparsionOperator;
  LIKE: IComparsionOperator;
}
