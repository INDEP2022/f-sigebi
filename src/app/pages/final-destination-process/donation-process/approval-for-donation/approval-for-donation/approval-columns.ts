import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const APPROVAL_COLUMNS = {
  cveAct: {
    title: 'Clave Evento',
    type: 'string',
    sort: false,
  },
  captureDate: {
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
  },
  elaborated: {
    title: 'Ingresó',
    type: 'string',
    sort: false,
  },
  estatusAct: {
    title: 'Estatus Evento',
    type: 'string',
    sort: false,
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
