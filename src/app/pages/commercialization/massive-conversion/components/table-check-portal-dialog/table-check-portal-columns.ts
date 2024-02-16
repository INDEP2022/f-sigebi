export const COLUMNS = {
  cretedBy: {
    title: 'Regional',
    type: 'string',
    sort: false,
  },
  records: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Importe',
    type: 'string',
    sort: false,
  },
};

export interface ICheckPortal {
  cretedBy: string;
  records: string;
  amount: number | null;
}
