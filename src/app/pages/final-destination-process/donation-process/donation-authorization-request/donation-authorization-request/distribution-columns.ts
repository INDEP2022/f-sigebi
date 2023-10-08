import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const DISTRIBUTION_COLUMNS = {
  id: {
    title: 'No. Solicitud',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.requestId?.id;
    },
  },
  doneeId: {
    title: 'Id.Donatario',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.doneeId?.id;
    },
  },
  donFedEnt: {
    title: 'Donatario',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.doneeId?.razonSocial;
    },
  },
  sunQuantity: {
    title: 'Cantidad Asignada',
    sort: false,
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);
      if (!isNaN(numericAmount)) {
        return numericAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } else {
        return amount;
      }
    },
  },
  requestStatus: {
    title: 'Estatus de Solicitud',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.requestId?.requestStatus;
    },
  },
  fedEntCve: {
    title: 'Cve. Ent. Federativa',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.entfed?.id;
    },
  },
};

export const PROPOSEL_COLUMN = {
  ID_PROPUESTA: {
    title: 'Id. Propuesta',
    sort: false,
  },
  ID_SOLICITUD: {
    title: 'No. Solicitud',
    sort: false,
  },
  FEC_PROPUESTA: {
    title: 'Fecha de Propuesta',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  CANT_SOLICITADA: {
    title: 'Cantidad Solicitada',
    sort: false,
  },
  CANT_PROPUESTA: {
    title: 'Cantidad de Propuesta',
    sort: false,
  },
  CANT_DONADA: {
    title: 'Cantidad Donada',
    sort: false,
  },
  FEC_ENTREGA: {
    title: 'Fecha de Entrega',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  FEC_AUTORIZA: {
    title: 'Fecha Autorizada',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  PRP_ESTATUS: {
    title: 'Estatus de Propuesta',
    sort: false,
  },
};

export const REQUEST_GOOD_COLUMN = {
  goodNumber: {
    title: 'Id. Propuesta',
    sort: false,
  },
  ID_SOLICITUD: {
    title: 'No. Solicitud',
    sort: false,
  },
  FEC_PROPUESTA: {
    title: 'Fecha de Propuesta',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  CANT_SOLICITADA: {
    title: 'Cantidad Solicitada',
    sort: false,
  },
  CANT_PROPUESTA: {
    title: 'Cantidad de Propuesta',
    sort: false,
  },
  CANT_DONADA: {
    title: 'Cantidad Donada',
    sort: false,
  },
  FEC_ENTREGA: {
    title: 'Fecha de Entrega',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  FEC_AUTORIZA: {
    title: 'Fecha Autorizada',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  PRP_ESTATUS: {
    title: 'Estatus de Propuesta',
    sort: false,
  },
};

export const COLUMNS_INVENTARY = {
  proposalKey: {
    title: 'Cve. Propuesta',
    sort: false,
  },
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
};
