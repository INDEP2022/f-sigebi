export const GOODS_WITH_REQUIRED_INFO_COLUMNS = {
  id: {
    title: 'No. Bien',
    type: 'number',
    valuePrepareFunction: (value: any) => (value ? value : ''),
    sort: false,
  },
  motive: {
    title: 'Motivo',
    sort: false,
    // valuePrepareFunction: (cell: any, row: any) => {
    //   return row.motive;
    // },
  },
};
