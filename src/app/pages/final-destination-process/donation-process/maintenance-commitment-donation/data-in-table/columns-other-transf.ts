import { CheckboxElementComponent_ } from './CheckboxDisabled';
export const COLUMNS_OTHER_TRANS = {
  labelId: {
    title: 'Etiqueta',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.description : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
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
    // valuePrepareFunction: (value: ITransferee) => {
    //   return value != null ? value.transferentId : '-';
    // },
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
  amount: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  yes: {
    title: 'S',
    type: 'custom',
    // filter: false,
    renderComponent: CheckboxElementComponent_,
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
    // filter: false,
    renderComponent: CheckboxElementComponent_,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
};
