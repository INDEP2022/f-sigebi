import { InputMaskCellComponent } from 'src/app/@standalone/smart-table/mask-cell/input-mask-cell.component';

export const REGIONAL_ACCOUNT_COLUMNS = {
  file: {
    title: 'No. Expediente',
    type: 'string',
    sort: false,
  },
  goodNumber: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  val14: {
    title: 'Importe',
    type: 'string',
    sort: false,
    valuePrepareFunction: (val: string) => {
      const formatter = new Intl.NumberFormat('en-US', {
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return formatter.format(Number(val));
    },
  },
  allInterest: {
    title: 'Interés',
    sort: false,
    type: 'custom',
    showAlways: true,
    renderComponent: InputMaskCellComponent<any>,
    onComponentInitFunction: (instance: InputMaskCellComponent) => {
      instance.inputType = 'text';
      //instance.value = instance.rowData.allInterest ?? 0
      instance.inputChange.subscribe({
        next: (resp: any) => {
          resp.row.allInterest = resp.value;

          resp.row.total =
            Number(resp.row.allInterest) + Number(resp.row.val14);

          instance.rowData.total = resp.row.total;
        },
      });
    },
  },
  total: {
    title: 'Total',
    type: 'string',
    sort: false,
    valuePrepareFunction: (val: string) => {
      const formatter = new Intl.NumberFormat('en-US', {
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return formatter.format(Number(val));
    },
  },
  val1: {
    title: 'Moneda',
    type: 'string',
    sort: false,
  },
};
