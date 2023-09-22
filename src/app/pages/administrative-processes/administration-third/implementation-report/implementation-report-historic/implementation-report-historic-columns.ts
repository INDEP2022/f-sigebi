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
  // numeraryFolio: {
  //   title: 'Folio',
  //   type: 'string',
  //   sort: false,
  // },
  // numTransfer_: {
  //   title: 'Transferente',
  //   type: 'number',
  //   sort: false,
  // },
  // elaborationDate: {
  //   title: 'Fecha de Elaboración',
  //   type: 'html',
  //   sort: false,
  //   valuePrepareFunction: (text: string) => {
  //     return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
  //   },
  //   filter: {
  //     type: 'custom',
  //     component: CustomDateFilterComponent,
  //   },
  // },
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
    title: 'No. Bien',
    type: 'number',
    sort: false,
    ValuePrepareFunction(cell: any, row: any) {
      return row.descripcion;
    },
  },
  DES_TIPO: {
    title: 'Descripción',
    type: 'string',
    sort: false,
    ValuePrepareFunction(cell: any, row: any) {
      return row.descripcion;
    },
  },
  DES_TURNO: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
    ValuePrepareFunction(cell: any, row: any) {
      return row.descripcion;
    },
  },
  DES_VARCOSTO: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
    ValuePrepareFunction(cell: any, row: any) {
      return row.descripcion;
    },
  },
  TOT_IMP_COSTO: {
    title: 'Cantidad',
    sort: false,
  },
};
