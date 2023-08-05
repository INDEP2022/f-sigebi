import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS = {
  changeStatus: {
    title: 'Cambia Estatus',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.changeStatus = data.toggle;
      });
    },
    filter: {
      type: 'checkbox',
      config: {
        true: true,
        false: false,
        resetText: 'x',
      },
    },
  },
  reportDelit: {
    title: 'Reporte Robo',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.reportDelit = data.toggle;
      });
    },
    filter: {
      type: 'checkbox',
      config: {
        true: true,
        false: false,
        resetText: 'x',
      },
    },
  },
  budgetItem: {
    title: 'Partida',
    sort: false,
  },
  cvman: {
    title: 'Transferente',
    sort: false,
  },
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  goodDescription: {
    title: 'Descripción',
    sort: false,
  },
  amount: {
    title: 'Monto',
    sort: false,
  },
  vat: {
    title: 'IVA',
    sort: false,
  },
  isrWithholding: {
    title: 'Retención ISR',
    sort: false,
  },
  vatWithholding: {
    title: 'Retención IVA',
    sort: false,
  },
  total: {
    title: 'Total',
    sort: false,
  },
};
