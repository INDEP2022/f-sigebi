import { ITransferee } from 'src/app/core/models/ms-r-approve-donation/r-approve-donation.model';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
export const COLUMNS_DATA_TABLE = {
  labelId: {
    title: 'Etiqueta',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  desStatus: {
    title: 'Des. Status',
    type: 'string',
    sort: false,
  },
  transfereeId: {
    title: 'No. Trans.',
    valuePrepareFunction: (value: ITransferee) => {
      return value != null ? value.transferentId : '-';
    },
    type: 'number',
    sort: false,
  },
  desTrans: {
    title: 'Des Trans.',
    type: 'string',
    sort: false,
  },
  clasifId: {
    title: 'No. Clasif.',
    type: 'number',
    sort: false,
  },
  desClasif: {
    title: 'Des. Clasif.',
    type: 'string',
    sort: false,
  },
  unit: {
    title: 'Unidad',
    type: 'string',
    sort: false,
  },
  yes: {
    title: 'S',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  not: {
    title: 'N',
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
