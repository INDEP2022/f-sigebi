import { getAddress } from 'src/app/core/services/ms-commer-concepts/concepts.service';

export const COLUMNS = {
  parameter: {
    title: 'Parámetro',
    sort: false,
  },
  value: {
    title: 'Valor',
    sort: false,
  },
  address: {
    title: 'Dirección',
    sort: false,
    class: 'w-md',
    editor: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: '', title: 'SELECCIONAR' },
          { value: 'M', title: 'MUEBLES' },
          { value: 'I', title: 'INMUEBLES' },
          { value: 'C', title: 'GENERAL' },
          { value: 'VIGILANCIA', title: 'VIGILANCIA' },
          { value: 'SEGUROS', title: 'SEGUROS' },
          { value: 'JURIDICO', title: 'JURÍDICO' },
          { value: 'ADMINISTRACIÓN', title: 'ADMINISTRACIÓN' },
        ],
      },
    },
    valuePrepareFunction: (value: any, row: any) => {
      // DATA FROM HERE GOES TO renderComponent
      return row.address ? getAddress(row.address) : '';
    },
  },
};
