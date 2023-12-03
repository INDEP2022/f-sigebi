import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const APPROVAL_COLUMNS = {
  cveAct_: {
    title: 'Clave Evento',
    type: 'string',
    sort: false,
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  captureDate_: {
    title: 'Fecha Captura',
    type: 'number',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('-').reverse().join('/') : ''}`;
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  elaborated_: {
    title: 'Ingresó',
    type: 'string',
    sort: false,
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  estatusAct_: {
    title: 'Estatus Evento',
    type: 'string',
    sort: false,
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
};

export const GOOD_COLUMNS = {
  goodId: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  amount: {
    title: 'Cantidad',
    sort: false,
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);
      if (!isNaN(numericAmount)) {
        return numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } else {
        return amount;
      }
    },
  },
};
