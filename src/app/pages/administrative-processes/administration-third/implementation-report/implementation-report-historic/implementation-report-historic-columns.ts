import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
export const IMPLEMENTATIONREPORTHISTORIC_COLUMNS = {
  // id: {
  //   title: 'No. Bitácora',
  //   sort: false,
  // },
  // formatNumber: {
  //   title: 'Fecha de cambio',
  //   sort: false,
  // },
  changeDate: {
    title: 'Fecha de Cambio',
    sort: false,
    valuePrepareFunction: (value: string) => formatDate(value),
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  justification: {
    title: 'Justificación',
    width: '30%',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  usrRegister: {
    title: 'Usuario',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.usrRegister.id;
    },
  },
};

export const ACTAS = {
  id: {
    title: 'Selección',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
  numberProceedings: {
    title: 'No. Acta',
    sort: false,
  },
  numberGood: {
    title: 'No. Bien',
    sort: false,
  },
  amount: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
};
export const COPY = {
  numberGood: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
};

export const GASTOS = {
  DES_SERVICIO: {
    title: 'Servicio',
    type: 'number',
    sort: false,
    ValuePrepareFunction(cell: any, row: any) {
      return row.DES_SERVICIO.descripcion;
    },
  },
  DES_TIPO: {
    title: 'Tipo',
    type: 'string',
    sort: false,
    ValuePrepareFunction(cell: any, row: any) {
      return row.DES_TIPO.descripcion;
    },
  },
  DES_TURNO: {
    title: 'Turno',
    type: 'string',
    sort: false,
    ValuePrepareFunction(cell: any, row: any) {
      return row.DES_TURNO.descripcion;
    },
  },
  DES_VARCOSTO: {
    title: 'Variable dde Costo',
    type: 'string',
    sort: false,
    ValuePrepareFunction(cell: any, row: any) {
      return row.DES_VARCOSTO.descripcion;
    },
  },
  TOT_IMP_COSTO: {
    title: 'Importe de Costo',
    sort: false,
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}
