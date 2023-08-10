export const BATCH_COLUMNS = {
  id: {
    title: 'Código',
    type: 'number',
    sort: false,
  },
  numStore: {
    title: 'Id Almacén',
    type: 'number',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.description : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.description;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  numRegister: {
    title: 'Id Registro',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estado',
    type: 'string',
    valuePrepareFunction: (value: string) => {
      if (value == 'V') return 'Activo';
      if (value == 'I') return 'Inactivo';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'V', title: 'Activo' },
          { value: 'I', title: 'Inactivo' },
        ],
      },
    },
    sort: false,
  },
};
