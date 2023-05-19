export const GOODS_WITH_REQUIRED_INFO_COLUMNS = {
  id: {
    title: 'No. Bien',
    valuePrepareFunction: (value: any) => (value ? value.id : ''),
    sort: false,
  },
  motive: {
    title: 'Motivo',
    sort: false,
  },
};
