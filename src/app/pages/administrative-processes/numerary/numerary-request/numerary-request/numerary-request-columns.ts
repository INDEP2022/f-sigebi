import { DateCellComponent } from 'src/app/@standalone/smart-table/date-cell/date-cell.component';
export const REQUEST_NUMERARY_COLUMNS = {
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
  commission: {
    title: 'Monto',
    type: 'string',
    sort: false,
  },
  bankDate: {
    title: 'Fecha Banco',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: string) => {
      console.log(value);

      return value
        ? value.includes('T')
          ? value.split('T')[0].split('-').reverse().join('/')
          : value.split('-').join('/')
        : value;
    },
  },
  dateCalculationInterests: {
    title: 'Fecha Tesofe',
    type: 'custom',
    sort: false,
    valuePrepareFunction: (value: string) => {
      return value ? value.split('-').join('/') : '';
    },
    renderComponent: DateCellComponent,
    onComponentInitFunction(instance?: any) {
      instance.inputChange.subscribe({
        next: (data: any) => {
          data.row.dateCalculationInterests = data.value;
        },
      });
    },
  },
};
