import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

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
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (value: any) => {
      if (value !== null) {
        switch (value) {
          case '0':
            value = false;
            return value;
            break;
          case '1':
            value = true;
            return value;
            break;
        }
      }
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
