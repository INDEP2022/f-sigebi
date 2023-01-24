import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
export const COLUMNS_EXPORT_GOODS = {
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
  quantity: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  clasificationNumb: {
    title: 'No. Clasf Bien',
    type: 'number',
    sort: false,
  },
  tansfNumb: {
    title: 'No. Transfer',
    type: 'number',
    sort: false,
  },
  delAdmin: {
    title: 'Del_Admin',
    type: 'number',
    sort: false,
  },
  delDeliv: {
    title: 'Del_Admin',
    type: 'number',
    sort: false,
  },
  recepDate: {
    title: 'Fecha Recepción',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'number',
    sort: false,
  },
  proceedingsNumb: {
    title: 'No. Expediente',
    type: 'number',
    sort: false,
  },
  cpd: {
    title: 'CPD',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  adm: {
    title: 'ADM',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  rda: {
    title: 'RDA',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
};
