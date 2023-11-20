export const PAGE_SETUP_COLUMNS = {
  idTable: {
    title: 'Tabla',
    sort: false,
  },
  idColumn: {
    title: 'Columna',
    sort: false,
  },
  aliastab: {
    title: 'Alias Tabla',
    sort: false,
  },
  ordencol: {
    title: 'Orden Columna',
    sort: false,
  },
  aliascol: {
    title: 'Alias Columna',
    sort: false,
  },
  visualiza: {
    title: 'Visualizar',
    sort: false,
    type: 'html',
    /*renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (value: any) => {
      if (value !== null) {
        switch (value) {
          case '0':
            value = false;
            return value;
          case '1':
            value = true;
            return value;
        }
      }
    },*/
    valuePrepareFunction: (value: string) => {
      if (value == '1')
        return '<strong><span class="badge badge-pill badge-success">Si</span></strong>';
      if (value == '0')
        return '<strong><span class="badge badge-pill badge-warning">No</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: '0', title: 'No Visualizar' },
          { value: '1', title: 'Visualizar' },
        ],
      },
    },
  },
};
