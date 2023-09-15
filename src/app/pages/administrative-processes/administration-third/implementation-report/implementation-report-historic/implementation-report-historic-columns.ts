import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
export const IMPLEMENTATIONREPORTHISTORIC_COLUMNS = {
  changeDate: {
    title: 'Fecha de cambio',
    width: '10%',
    sort: false,
  },
  justification: {
    title: 'Justificación',
    width: '30%',
    sort: false,
  },
  status: {
    title: 'Estatus',
    width: '10%',
    sort: false,
  },
  user: {
    title: 'Usuario',
    width: '10%',
    sort: false,
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
  numberProceedingss: {
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
