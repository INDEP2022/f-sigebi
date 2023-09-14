export const STATION_COLUMS = {
  id: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },
  stationName: {
    title: 'Estación',
    type: 'number',
    sort: false,
  },
  transferentRe: {
    title: 'Transferencia',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.nameTransferent : '';
    },
  },
  status: {
    title: 'Estado',
    type: 'html',
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
  keyState: {
    title: 'Estado Clave',
    type: 'string',
    sort: false,
  },
  version: {
    title: 'Versión',
    type: 'string',
    sort: false,
  },
};
