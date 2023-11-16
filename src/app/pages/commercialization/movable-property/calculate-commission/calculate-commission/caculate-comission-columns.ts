import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COMCALCULATED_COLUMS = {
  comCalculatedId: {
    title: 'Id',
    type: 'string',
    sort: false,
    width: '8%',
  },
  thirdComerId_Id: {
    title: 'Tercero',
    type: 'string',
    sort: false,
    // valuePrepareFunction: (value: any) => {
    //   return value.thirdComerId;
    // },
    width: '8%',
  },
  nameReason: {
    title: 'Nombre',
    type: 'string',
    sort: false,
    width: '25%',
  },
  startDate: {
    title: 'Fecha Inicio',
    // type: 'string',
    sort: false,
    width: '12%',
    type: 'html',
    valuePrepareFunction: (text: string) => {
      console.log('text', text);
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  endDate: {
    title: 'Fecha Fin',
    // type: 'string',
    sort: false,
    width: '12%',
    type: 'html',
    valuePrepareFunction: (text: string) => {
      console.log('text', text);
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  eventId: {
    title: 'Evento',
    type: 'string',
    sort: false,
    width: '10%',
  },
  processKey: {
    title: 'Cve. Proceso',
    type: 'string',
    sort: false,
    width: '25%',
  },
  changeType: {
    title: 'Tipo de Cambio',
    type: 'string',
    sort: false,
    width: '10%',
  },
};

export const COMISIONESXBIEN_COLUMNS = {
  // comCalculatedId: {
  //   title: 'Id. Calcula',
  //   type: 'string',
  //   sort: false,
  //   width: '10%'
  // },
  event: {
    title: 'Id Evento',
    type: 'string',
    sort: false,
    width: '10%',
  },
  batch: {
    title: 'Lote',
    type: 'string',
    sort: false,
    width: '10%',
  },
  good: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
    // valuePrepareFunction: (value: any) => {
    //   return value.id;
    // },
    width: '10%',
  },
  cvman: {
    title: 'Cvman',
    type: 'string',
    sort: false,
  },
  sale: {
    title: 'Venta',
    type: 'html',
    sort: false,
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  amountCommission: {
    title: 'Monto Comisión',
    type: 'html',
    sort: false,
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 14,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  processIt: {
    title: 'Procesa',
    type: 'string',
    sort: false,
  },
  comments: {
    title: 'Comentarios',
    type: 'string',
    sort: false,
  },

  // saleTc: {
  //   title: 'Sale TC',
  //   type: 'string',
  //   sort: false,
  // },
};
