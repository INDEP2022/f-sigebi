export const LEGAL_AFFAIR_COLUMNS = {
  id: {
    title: 'Código',
    sort: false,
    width: '35px',
  },
  legalAffair: {
    title: 'Descripción',
    sort: false,
    filter: {
      config: {},
    },
  },
  status: {
    title: 'Status',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1') return 'Activo';
      if (value == '0') return 'Inactivo';

      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: '1', title: 'Activo' },
          { value: '0', title: 'Inactivo' },
        ],
      },
    },
  },
};
